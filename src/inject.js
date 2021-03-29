/* global fetch, Request, Headers, chrome, localStorage */

const STRIFF_BOT_GITHUB_API = "https://api.striff.io/v1/github/striffs";
const GITHUB_TOKEN_KEY = "x-github-token";
const GREEN_CHECK_MARK =
  '<svg style="color:#00bd43;float: left;margin-top: 1px;margin-left:-2px;margin-right: 5px;display:block;" class="octicon octicon-check-circle-fill flex-shrink-0 " title="This step passed" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" style="color: #7dffc9;"><path fill-rule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zm3.78-9.72a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z"></path></svg>';
const FAILURE_ICON =
  '<svg style="margin-right: 4px; float:left; margin-top: 2px; margin-left: 0px;" class="octicon octicon-issue-opened UnderlineNav-octicon d-none d-sm-inline text-red" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path></svg>';
const NOCHANGE_ICON =
  '<svg style="margin-right: 4px; float:left; margin-top: 2px; margin-left: 0px;" class="octicon octicon-shield UnderlineNav-octicon d-none d-sm-inline text-orange" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.467.133a1.75 1.75 0 011.066 0l5.25 1.68A1.75 1.75 0 0115 3.48V7c0 1.566-.32 3.182-1.303 4.682-.983 1.498-2.585 2.813-5.032 3.855a1.7 1.7 0 01-1.33 0c-2.447-1.042-4.049-2.357-5.032-3.855C1.32 10.182 1 8.566 1 7V3.48a1.75 1.75 0 011.217-1.667l5.25-1.68zm.61 1.429a.25.25 0 00-.153 0l-5.25 1.68a.25.25 0 00-.174.238V7c0 1.358.275 2.666 1.057 3.86.784 1.194 2.121 2.34 4.366 3.297a.2.2 0 00.154 0c2.245-.956 3.582-2.104 4.366-3.298C13.225 9.666 13.5 8.36 13.5 7V3.48a.25.25 0 00-.174-.237l-5.25-1.68zM9 10.5a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.75a.75.75 0 10-1.5 0v3a.75.75 0 001.5 0v-3z"></path></svg>';
const LOADING_CIRCLE =
  '<svg style="float:left; margin-top:2px; display:block;" fill="none" height="16" viewBox="0 0 16 16" width="16" class="anim-rotate js-check-step-loader mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg"><g stroke-width="2"><circle cx="8" cy="8" r="7" stroke="#959da5"></circle><path d="m12.9497 3.05025c1.3128 1.31276 2.0503 3.09323 2.0503 4.94975 0 1.85651-.7375 3.637-2.0503 4.9497" stroke="#fafbfc"></path></g></svg>';
const storage = chrome.storage.sync || chrome.storage.local;
const REPORT_HEADER =
  '<title>Striff Report</title><style>article { overflow:hidden;} @media only screen and (max-width: 600px) { body { width:95%; padding:0px;} } @media only screen and (max-width: 1200px) { body { margin-left:auto; margin-right:auto; padding:10px; display:block; max-width:1000px; width:90%;} } @media only screen and (min-width: 1200px) { body { margin-left:auto; padding:30px; margin-right:auto; display:block; width:80%; } }</style><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css"><article class="markdown-body">';
const REPORT_FOOTER =
  '<script>var striffDivs = document.getElementsByClassName(\"striff\"); for (var i = 0; i < striffDivs.length; i++) { striffDivs.item(i).innerHTML = window.atob(striffDivs.item(i).textContent); }</script><script src="https://unpkg.com/panzoom@9.4.0/dist/panzoom.min.js"></script><script>var gEles = document.querySelectorAll("g"); [].forEach.call(gEles, function(gEle) { panzoom(gEle); });var svgEles = document.querySelectorAll("svg"); [].forEach.call(svgEles, function(svgEle) { svgEle.style.border="1px solid #808080a6"; svgEle.style.width="100%"; svgEle.style.height="80%"; svgEle.style.minHeight="800px";svgEle.style.cursor="move";svgEle.style.marginBottom="10%";});</script></article>';
let githubToken;
let reponseObj;
let repoOwner;
let repoName;
let pullNo;

const processResponse = (response) => {
  if (response.status > 200) {
    truncatedErrorMsg = response.body.errorMessage;
    if (truncatedErrorMsg.length > 23) {
      truncatedErrorMsg = truncatedErrorMsg.substring(0, 20) + "...";
    }
    updateStriffBtn(truncatedErrorMsg, response.body.errorMessage, "failure");
  } else {
    if (
      "striffsMap" in response.body &&
      Object.keys(response.body.striffsMap).length > 0
    ) {
      updateStriffBtn(
        "Striffs generated",
        "Striff diagrams were successfully generated.",
        "success"
      );
      displayStriffs(response.body);
    } else {
      // No structural changes found
      updateStriffBtn(
        "No changes found...",
        "No structural changes were detected in this pull request.",
        "no_change"
      );
    }
  }
  document.getElementById("striff_btn").disabled = true;
};

const parseResponse = (response) => {
  console.log(response);
  return response.json().then((data) => ({
    status: response.status,
    body: data,
  }));
};

const fetchStriffMetadata = (repoOwner, repoName, pullNo) => {
  var reqParams = {};
  if (window.location.hostname === "github.com") {
    reqParams["gh_hostname"] = "api.github.com";
  } else {
    // User is using GitHub enterprise
    reqParams["gh_hostname"] = window.location.hostname;
  }
  var striffReqURL =
    STRIFF_BOT_GITHUB_API +
    "/owners/" +
    repoOwner +
    "/repos/" +
    repoName +
    "/pulls/" +
    pullNo +
    "?" +
    new URLSearchParams(reqParams);
  const request = new Request(encodeURI(striffReqURL));
  const headerObj = {
    Accept: "application/json",
  };
  const token = githubToken || localStorage.getItem(GITHUB_TOKEN_KEY);
  if (token) {
    headerObj.Authorization = "token " + token;
  }
  fetch(request, {
    method: "GET",
    headers: headerObj,
  })
    .then(parseResponse)
    .then(processResponse)
    .catch(function (err) {
      console.log(err);
      updateStriffBtn(
        "Unexpected error...",
        "An unexpected error was encountered while processing this request.",
        "failure"
      );
    });
};

const checkForPullRequestPage = () => {
  let repoURI = window.location.pathname.substring(1);
  if (
    repoURI.match(/.*\/pull\/[0-9]*/) &&
    window.location.href.includes("github.com")
  ) {
    // Current page is GitHub Pull Request, retrieve important values
    repoOwner = window.location.pathname.split("/")[1];
    repoName = window.location.pathname.split("/")[2];
    pullNo = window.location.pathname.split("/")[4];
    // Create striff button
    var striffTabNav = document.getElementById("striffTabNav");
    if (striffTabNav == null) {
      var ghTabNavs = document.getElementsByClassName("tabnav-tabs")[0];
      var imageURL = chrome.runtime.getURL("icons/clarity-bot.svg");
      ghTabNavs.innerHTML +=
        '<button type="submit" class="btn btn-sm btn-with-count js-toggler-target" aria-label="View striff diagrams for this pull request." title="View striff diagrams for this pull request." id="striff_btn" style="margin-left: 15px;padding-left: 5px; min-width:110px; padding-right:15px; overflow: hidden; border-radius: 5px; margin-bottom: 10px; margin-top: 7px; background-color: #f3f3f3; float: right; margin-left: auto;"> <div id="striff_btn_div" style="margin-right: 5px; margin-left: 5px;"><div id="striff_btn_icon_div"><img style="float:left; display:block; margin-top: 2px;margin-bottom: -2px;margin-right: 5px;" id="structure_diff_btn_img" src="' +
        imageURL +
        '"></div><span style="padding-right: 5px;" id="striff_btn_text">Striff Report</span></div></button>';
    }
    // create event listener for the structure-diff button
    var striffBtn = document.getElementById("striff_btn");
    striffBtn.addEventListener("click", function () {
      showLoaderBtnIcon();
      // start generating structure-diff...
      fetchStriffMetadata(repoOwner, repoName, pullNo);
    });
  }
};

const setButtonIcon = (type) => {
  if (type === "success") {
    showSuccessBtnIcon();
  } else if (type === "failure") {
    showFailureBtnIcon();
  } else if (type === "loading") {
    showLoaderBtnIcon();
  } else if (type === "no_change") {
    showNoChangesBtnIcon();
  }
};

const updateStriffBtn = (btnText, hoverText, status) => {
  var striffBtn = document.getElementById("striff_btn");
  striffBtn.setAttribute("aria-label", hoverText);
  striffBtn.setAttribute("title", hoverText);
  var striffBtnText = document.getElementById("striff_btn_text");
  striffBtnText.innerHTML = btnText;
  setButtonIcon(status);
};

const displayStriffs = (striffRespJson) => {
  chrome.extension.sendMessage({
    msg: ["openStriffTab", generateStriffHTML(striffRespJson)],
  });
};

const generateStriffHTML = (striffRespJson) => {
  var htmlText = REPORT_HEADER;
  for (var language in striffRespJson.striffsMap) {
    if (striffRespJson.striffsMap.hasOwnProperty(language)) {
      htmlText +=
        "<h1>" +
        repoOwner +
        "/" +
        repoName +
        '<span style="color:grey"> Pull #' +
        pullNo +
        "</span>" +
        "</h1>" +
        "<p>Learn more about striff diagrams at <a target=\"_blank\" href=\"https://striff.io\">striff.io</a></p>" +
        "<h3>" +
        "<code>" +
        language.charAt(0).toUpperCase() +
        language.slice(1) +
        "</code>" +
        " Striff Diagrams</h3>";
      for (striffObjIdx in striffRespJson.striffsMap[language]) {
        htmlText += '<div class="striff">' +
          striffRespJson.striffsMap[language][striffObjIdx][
            "base64encodedSVGCode"
          ] + "</div>"
      }
    }
  }
  htmlText += REPORT_FOOTER;
  return htmlText;
};

storage.get(GITHUB_TOKEN_KEY, function (data) {
  githubToken = data[GITHUB_TOKEN_KEY];
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes[GITHUB_TOKEN_KEY]) {
      githubToken = changes[GITHUB_TOKEN_KEY].newValue;
    }
  });
  document.addEventListener("pjax:end", checkForPullRequestPage, false);
  checkForPullRequestPage();
});

const token = githubToken || localStorage.getItem(GITHUB_TOKEN_KEY);

const showLoaderBtnIcon = () => {
  var imageHolder = document.getElementById("striff_btn_icon_div");
  imageHolder.innerHTML = LOADING_CIRCLE;
  var striffBtnText = document.getElementById("striff_btn_text");
  striffBtnText.innerHTML = "Generating";
};

const showSuccessBtnIcon = () => {
  var imageHolder = document.getElementById("striff_btn_icon_div");
  imageHolder.innerHTML = GREEN_CHECK_MARK;
};

const showFailureBtnIcon = () => {
  var imageHolder = document.getElementById("striff_btn_icon_div");
  imageHolder.innerHTML = FAILURE_ICON;
};

const showNoChangesBtnIcon = () => {
  var imageHolder = document.getElementById("striff_btn_icon_div");
  imageHolder.innerHTML = NOCHANGE_ICON;
};

// investigate https://github.com/caddyserver/caddy/pull/3712
