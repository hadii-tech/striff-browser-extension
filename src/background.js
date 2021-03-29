/* global chrome, alert, prompt, confirm */

const GITHUB_TOKEN_KEY = "x-github-token";
const TOKEN_FEATURE_INFORMATION_KEY = "user-knows-token-feature";
const storage = chrome.storage.sync || chrome.storage.local;
const striffReportPage = "templates/striff-report.html";

function setGithubToken(key, cb) {
  const obj = {};
  obj[GITHUB_TOKEN_KEY] = key;
  storage.set(obj, function () {
    alert(
      "Your Github token has been set successfully. Reload the Github page to see changes."
    );
    localStorage.setItem(GITHUB_TOKEN_KEY, key)
    cb();
  });
  
}

function handleOldGithubToken(cb) {
  storage.get(GITHUB_TOKEN_KEY, function (storedData) {
    const oldGithubToken = storedData[GITHUB_TOKEN_KEY];
    if (oldGithubToken) {
      if (
        confirm(
          "You have already set your Github token. Do you want to remove it?"
        )
      ) {
        storage.remove(GITHUB_TOKEN_KEY, function () {
          alert(
            "You have successfully removed Github token. Click extension icon again to set a new token."
          );
          cb(false);
        });
      } else {
        cb(false);
      }
    } else {
      cb(true);
    }
  });
}

const userNowKnowsAboutGithubTokenFeature = (cb) => {
  const obj = {};
  obj[TOKEN_FEATURE_INFORMATION_KEY] = true;
  storage.set(obj, cb);
};

function informUserAboutGithubTokenFeature() {
  storage.get(TOKEN_FEATURE_INFORMATION_KEY, function (storedData) {
    const userKnows = storedData[TOKEN_FEATURE_INFORMATION_KEY];
    if (!userKnows) {
      if (
        confirm(
          "The striff-bot GitHub browser extension requires a Github personal access tokens. Do you want to add one now?"
        )
      ) {
        askGithubToken(() => {
          userNowKnowsAboutGithubTokenFeature(() => {});
        });
      } else {
        userNowKnowsAboutGithubTokenFeature(() => {
          alert("You can click the extension icon to set a token.");
        });
      }
    }
  });
}

const askGithubToken = (cb) => {
  const githubToken = prompt("Please enter your Github token");
  if (githubToken === null) return;
  if (githubToken) {
    setGithubToken(githubToken, cb);
  } else {
    alert("You have entered an empty token.");

    cb();
  }
};

chrome.browserAction.onClicked.addListener((tab) => {
  handleOldGithubToken((askToSetToken) => {
    if (askToSetToken) {
      askGithubToken(() => {});
    }
  });
});

informUserAboutGithubTokenFeature();

chrome.extension.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  var senderWindowId = sender.tab.windowId;
  if (request.msg[0] == "openStriffTab") {
    chrome.tabs.create({
      url: "javascript:document.write('" + request.msg[1] + "')",
      active: false,
    });
  }
});
