
const GITHUB_TOKEN_KEY = "x-github-token";
const storage = chrome.storage.sync || chrome.storage.local;
let prInfo = []

chrome.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  var senderTab = sender.tab
  if (senderTab != null) {
    //var senderWindowId = sender.tab.windowId;
  }
  if (request.msg[0] == "openStriffWindow") {
    prInfo = request.msg[1]
    chrome.windows.create({url: "striff-report.html", type: "popup"});
  } else if (request.msg[0] == "setToken") {
    setGithubToken(request.msg[1])
    sendResponse(true);
  } else if (request.msg[0] == "getToken") {
    storage.get(GITHUB_TOKEN_KEY, function (data) {
      var githubToken = data[GITHUB_TOKEN_KEY];
      sendResponse(githubToken);
    });
  } else if (request.msg[0] == "getPRInfo") {
    sendResponse(prInfo);    
  } 
  return true;
});

function setGithubToken(value) {
  const obj = {};
  obj[GITHUB_TOKEN_KEY] = value;
  storage.set(obj)
}

