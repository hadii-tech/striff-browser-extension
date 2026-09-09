const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// computeDocRuleCoverage / formatDocRuleHeadline are pure functions, but they live inside
// striffs.js -- a content-script IIFE that touches window/document at load and so cannot be
// require()d in node. Extract just those two function declarations from the source and evaluate
// them in a sandbox, so the test exercises the real shipped code rather than a copy.
function extractFunction(source, name) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `could not find ${name} in striffs.js`);
  const braceStart = source.indexOf('{', start);
  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`unbalanced braces extracting ${name}`);
}

const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'striffs.js'), 'utf8');
const sandbox = {};
vm.runInNewContext(
  `${extractFunction(src, 'computeDocRuleCoverage')}\n${extractFunction(src, 'formatDocRuleHeadline')}\n` +
    'this.computeDocRuleCoverage = computeDocRuleCoverage; this.formatDocRuleHeadline = formatDocRuleHeadline;',
  sandbox
);
const { computeDocRuleCoverage: rawCoverage, formatDocRuleHeadline } = sandbox;
// rawCoverage returns an object from the vm realm, whose prototype is not this realm's
// Object.prototype -- strict deepEqual would reject it on that alone. Re-shape into a plain
// local object so the comparison is about the values, which is what these tests are for.
const computeDocRuleCoverage = (result) => {
  const c = rawCoverage(result);
  return { total: c.total, atRisk: c.atRisk, upheld: c.upheld, unclear: c.unclear };
};

test('computeDocRuleCoverage tallies at-risk, upheld and unclear separately', () => {
  const result = {
    docFactVerdicts: [
      { status: 'VIOLATED' },
      { status: 'PRE_EXISTING' },
      { status: 'MAINTAINED' },
      { status: 'RESTORED' },
      { status: 'UNCLEAR' },
      { status: 'unclear' }, // case-insensitive
      null, // filtered out
    ],
  };
  assert.deepEqual(computeDocRuleCoverage(result), {
    total: 6,
    atRisk: 2, // VIOLATED + PRE_EXISTING
    upheld: 2, // MAINTAINED + RESTORED
    unclear: 2, // UNCLEAR (x2); never counted as at-risk
  });
});

test('computeDocRuleCoverage returns zeros when there are no verdicts', () => {
  assert.deepEqual(computeDocRuleCoverage({}), { total: 0, atRisk: 0, upheld: 0, unclear: 0 });
  assert.deepEqual(computeDocRuleCoverage(null), { total: 0, atRisk: 0, upheld: 0, unclear: 0 });
  assert.deepEqual(computeDocRuleCoverage({ docFactVerdicts: 'nope' }), {
    total: 0, atRisk: 0, upheld: 0, unclear: 0,
  });
});

test('computeDocRuleCoverage does not fold UNCLEAR into upheld', () => {
  const result = { docFactVerdicts: [{ status: 'MAINTAINED' }, { status: 'UNCLEAR' }] };
  const c = computeDocRuleCoverage(result);
  assert.equal(c.total, 2);
  assert.equal(c.upheld, 1);
  assert.equal(c.unclear, 1);
  assert.equal(c.atRisk, 0);
});

test('formatDocRuleHeadline reads "at risk" when any verdict is at risk', () => {
  assert.equal(formatDocRuleHeadline({ total: 5, atRisk: 2 }), '5 documented rules · 2 at risk');
  assert.equal(formatDocRuleHeadline({ total: 1, atRisk: 1 }), '1 documented rule · 1 at risk');
});

test('formatDocRuleHeadline reads "all upheld" when nothing is at risk', () => {
  assert.equal(formatDocRuleHeadline({ total: 3, atRisk: 0 }), '3 documented rules · all upheld');
  assert.equal(formatDocRuleHeadline({ total: 1, atRisk: 0 }), '1 documented rule · all upheld');
  // UNCLEAR present but nothing at risk still reads as upheld (unclear is not at-risk).
  assert.equal(formatDocRuleHeadline({ total: 2, atRisk: 0, unclear: 1 }), '2 documented rules · all upheld');
});

test('formatDocRuleHeadline is empty when there are no documented rules', () => {
  assert.equal(formatDocRuleHeadline({ total: 0 }), '');
  assert.equal(formatDocRuleHeadline({}), '');
  assert.equal(formatDocRuleHeadline(null), '');
});
