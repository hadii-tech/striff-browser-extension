/* global fetch, Request, Headers, chrome, localStorage */

const CLARITY_BOT_STRUCTURE_DIFF_API = 'https://api.clarity-bot.com/v1/github/diff';
const LI_TAG_ID = 'github-repo-size'
const GITHUB_TOKEN_KEY = 'x-github-token'
const GREEN_CHECK_MARK = "<svg style=\"margin-top: 1.5px;\" aria-hidden=\"true\" class=\"octicon octicon-check text-green\" height=\"16\" version=\"1.1\" viewBox=\"0 0 12 18\" width=\"12\"><path fill-rule=\"evenodd\" d=\"M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z\"></path></svg>"
const RED_CROSS = "<svg aria-hidden=\"true\" class=\"octicon octicon-x text-red\" height=\"16\" version=\"1.1\" viewBox=\"0 0 12 18\" width=\"12\"><path fill-rule=\"evenodd\" d=\"M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z\"></path></svg>"
const YELLOW_CIRCLE = "<svg aria-hidden=\"true\" class=\"octicon octicon-primitive-dot mx-auto d-block bg-pending\" height=\"8\" version=\"1.1\" viewBox=\"0 0 8 12\" width=\"8\"><path fill-rule=\"evenodd\" d=\"M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z\"></path></svg>"

const storage = chrome.storage.sync || chrome.storage.local

let githubToken

const getRepoInfoURI = (uri) => {
  const repoURI = uri.split('/')
  return repoURI[0] + '/' + repoURI[1]
}

const getRepoContentURI = (uri) => {
  const repoURI = uri.split('/')
  const treeBranch = repoURI.splice(2, 2, 'contents')

  if (treeBranch && treeBranch[1]) {
    repoURI.push('?ref=' + treeBranch[1])
  }
  return repoURI.join('/')
}

const checkClarityBotStatus = (response) => {
  if (response.status == 509) {
    setButtonHoverMessage("Generated structure-diff is too large and will not be displayed.")
    throw Error()
  } else if (response.status == 204) {
    setButtonHoverMessage("Generated structure-diff is empty.")
    throw Error()
  } else if (response.status >= 200 && response.status < 300) {
    return response
  } else if (response.status == 401) {
    setButtonHoverMessage("Invalid or non-existent token supplied, click on the structure-diff chrome extension button to set an OAuth token.")
    throw Error()
  } else {
    setButtonHoverMessage("Oops! An unexpected error was encountered while processing this request.")
    throw Error(`clarity-bot structure-diff API encountered an error while processing this request.`)
  }
}

const checkGitHubStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else if (response.status == 403) {
    setButtonHoverMessage("GitHub Rate Limit exceeded or invalid token, click the structure-diff chrome extension button to set an OAuth token.")
    throw Error(`GitHub Rate Limit exceeded or invalid token, set an GitHub oAuth token to increase your rate limit.`)
  } else {
    throw Error(`GitHub returned a bad status: ${response.status}. If this is a private repository, click the structure-diff chrome extension button to set an OAuth token.`)
  }
}

const parseJSON = (response) => {
  if (response) {
    return response.json()
  }
  throw Error('Could not parse API response JSON')
}

const parseText = (response) => {
  if (response) {
    return response.text()
  }
  throw Error('Could not parse API response text')
}

const fetchStriffMetadata = (pullRequestObj, changedFiles) => {

  let repoURI = window.location.pathname.substring(1);
  var baseRepoOwner = window.location.pathname.split('/')[1];
  var baseRepoName = window.location.pathname.split('/')[2];
  var baseSHA = pullRequestObj.base.sha;
  if (pullRequestObj.head === null || pullRequestObj.head.repo === null || pullRequestObj.head.repo.owner === null) {
    showFailure();
    setButtonHoverMessage("The head branch is unreachable!")
    return;
  }
  var headRepoOwner = pullRequestObj.head.repo.owner.login;
  var headRepoName = pullRequestObj.head.repo.name;
  var headSHA = pullRequestObj.head.sha;
  var issueNo = window.location.pathname.split('/')[4];
  var prURL = window.location.href;
  var prId = pullRequestObj.id;
  var access_token = localStorage.getItem(GITHUB_TOKEN_KEY) || githubToken;

  var sdRequestOj = {
    headRepoOwner: headRepoOwner,
    headRepoName: headRepoName,
    headSha: headSHA,
    baseRepoOwner: baseRepoOwner,
    baseRepoName: baseRepoName,
    baseSha: baseSHA,
    prUrl: prURL,
    issueNo: issueNo,
    prId: prId,
    changedFiles: changedFiles
  };

  var data = new FormData();
  data = JSON.stringify(sdRequestOj);
  var sdReqURL = CLARITY_BOT_STRUCTURE_DIFF_API;

  // add token if available
  if (access_token) {
    sdReqURL += '&token=' + access_token;
  }

  console.log(sdReqURL);
  const request = new Request(encodeURI(sdReqURL));
  fetch(request, 
  {
    method: "POST",
    body: data,
  })
    .then(checkClarityBotStatus)
    .then(parseText)
    .then(displayResult)
    .catch(function(err) {
      console.log(err);
      showFailure()
    });
}

const githubPullRequest = (url) => {

  // TODO: make use of the token if set...
  const token = localStorage.getItem(GITHUB_TOKEN_KEY) || githubToken;
  const pullRequestRequest = new Request(url)
  fetch(pullRequestRequest)
    .then(checkGitHubStatus)
    .then(parseJSON)
    .then(
      function(pullRequest) {
        changedFilesUrl = 'https://api.github.com/repos/' + pullRequest.base.repo.owner.login + '/' + pullRequest.base.repo.name + '/pulls/' + window.location.pathname.split('/')[4] + '/files';
        const changedFilesRequest = new Request(changedFilesUrl)
        fetch(changedFilesRequest)
          .then(checkGitHubStatus)
          .then(parseJSON)
          .then(
            function(changedFiles) {
              var changedSourceFiles = []
              var arrayLength = changedFiles.length;
              for (var i = 0; i < arrayLength; i++) {
                changedSourceFiles.push(changedFiles[i]['filename']);
              }
              fetchStriffMetadata(pullRequest, changedSourceFiles);
            }
          )
          .catch(function(err) {
            console.log(err);
            showFailure();
          });
      }
    )
    .catch(function(err) {
      console.log(err);
      showFailure();
    });
}

const getFileName = (text) => text.trim().split('/')[0]

const checkForPullRequestPage = () => {
  let repoURI = window.location.pathname.substring(1)
  if (repoURI.match(/.*\/pull\/[0-9]*/)) {
    // the current page represets a GitHub Pull Request

    // ensure structure-diff btn does not already exist.
    var structureDiffButton = document.getElementById("structure_diff_btn");
    if (structureDiffButton !== null) {
      document.getElementById("structure_diff_btn").outerHTML = '';
    }

    // retrieve important values
    var repoOwner = window.location.pathname.split('/')[1];
    var repoName = window.location.pathname.split('/')[2];
    var issueNo = window.location.pathname.split('/')[4];

    // create and append the structure-diff button to the page
    var topButtonList = document.getElementsByClassName("pagehead-actions")[0];
    var structureDiffButton = document.getElementsByClassName("btn btn-sm btn-with-count")[1].cloneNode(true);
    structureDiffButton.removeAttribute('data-ga-click');
    structureDiffButton.setAttribute('title', 'Generate a structure-diff for this pull request');
    structureDiffButton.setAttribute('href', '#structure-diff-box');
    structureDiffButton.setAttribute('aria-label', 'Generate a structure-diff for this pull request');
    structureDiffButton.setAttribute('id', 'structure_diff_btn');
    var imageURL = chrome.runtime.getURL("icons/clarity-bot.svg");
    structureDiffButton.innerHTML = '<div style="display:inline-block; border-radius:50%; margin-right: 2px;" id="sdImage"><img style="width: 16px; margin-top: 2px;margin-bottom: -2px;" src="' + imageURL + '"></div> Structure-Diff';
    var li = document.createElement("li");
    li.appendChild(structureDiffButton);
    topButtonList.appendChild(li);

    // create event listener for the structure-diff button
    structureDiffButton.addEventListener('click', function() {

      showLoader();
      // start generating structure-diff...
      githubPullRequest('https://api.github.com/repos/' + repoOwner + '/' + repoName + '/pulls/' + issueNo);
    });
  }

}

const showLoader = () => {
  var imageHolder = document.getElementById("sdImage");
  imageHolder.innerHTML = YELLOW_CIRCLE;
  imageHolder.className += "button-glow"
  imageHolder.style.backgroundColor = "rgb(219, 171, 9)";
  setButtonHoverMessage("Your structure-diff is being generated...")

}


const showSuccess = () => {
  var imageHolder = document.getElementById("sdImage");
  imageHolder.innerHTML = GREEN_CHECK_MARK;
  imageHolder.className -= "button-glow"
  imageHolder.style.backgroundColor = "transparent";
  setButtonHoverMessage("Your structure-diff was successfully generated.")
}

const showFailure = () => {
  var imageHolder = document.getElementById("sdImage");
  imageHolder.innerHTML = RED_CROSS;
  imageHolder.className -= "button-glow"
  imageHolder.style.backgroundColor = "transparent";
}

const setButtonHoverMessage = (message) => {
  var structureDiffButton = document.getElementById("structure_diff_btn");
  structureDiffButton.setAttribute('aria-label', message);
  structureDiffButton.setAttribute('title', message);
}

const displayResult = (diffId) => {
  showSuccess();
  chrome.extension.sendMessage({
    msg: ["openTab", CLARITY_BOT_STRUCTURE_DIFF_API + '/' + diffId]
  });
}


storage.get(GITHUB_TOKEN_KEY, function(data) {
  githubToken = data[GITHUB_TOKEN_KEY]
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes[GITHUB_TOKEN_KEY]) {
      githubToken = changes[GITHUB_TOKEN_KEY].newValue
    }
  })
  document.addEventListener('pjax:end', checkForPullRequestPage, false)
  checkForPullRequestPage()
})