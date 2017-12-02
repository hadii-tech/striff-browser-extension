/* global chrome, alert, prompt, confirm */

const GITHUB_TOKEN_KEY = 'x-github-token'
const TOKEN_FEATURE_INFORMATION_KEY = 'user-knows-token-feature'
const CLARITY_BOT_STRUCTURE_DIFF_API_URL = 'http://localhost:8080/v1/github/diff'

const storage = chrome.storage.sync || chrome.storage.local

function setGithubToken (key, cb) {
  const obj = {}

  obj[GITHUB_TOKEN_KEY] = key

  storage.set(obj, function () {
    alert('Your Github token has been set successfully. Reload the Github page to see changes.')

    cb()
  })
}

function handleOldGithubToken (cb) {
  storage.get(GITHUB_TOKEN_KEY, function (storedData) {
    const oldGithubToken = storedData[GITHUB_TOKEN_KEY]

    if (oldGithubToken) {
      if (confirm('You have already set your Github token. Do you want to remove it?')) {
        storage.remove(GITHUB_TOKEN_KEY, function () {
          alert('You have successfully removed Github token. Click extension icon again to set a new token.')

          cb(false)
        })
      } else {
        cb(false)
      }
    } else {
      cb(true)
    }
  })
}

const userNowKnowsAboutGithubTokenFeature = (cb) => {
  const obj = {}
  obj[TOKEN_FEATURE_INFORMATION_KEY] = true

  storage.set(obj, cb)
}

function informUserAboutGithubTokenFeature () {
  storage.get(TOKEN_FEATURE_INFORMATION_KEY, function (storedData) {
    const userKnows = storedData[TOKEN_FEATURE_INFORMATION_KEY]

    if (!userKnows) {
      if (confirm('GitHub Structure-Diffs supports private repositories through Github personal access tokens. Do you want to add a token?')) {
        askGithubToken(() => {
          userNowKnowsAboutGithubTokenFeature(() => {})
        })
      } else {
        userNowKnowsAboutGithubTokenFeature(() => {
          alert('You can click extension icon to set a token.')
        })
      }
    }
  })
}

const askGithubToken = (cb) => {
  const githubToken = prompt('Please enter your Github token')

  if (githubToken === null) return

  if (githubToken) {
    setGithubToken(githubToken, cb)
  } else {
    alert('You have entered an empty token.')

    cb()
  }
}

const openNewTab = (url) => {
  chrome.tabs.create({url: url, selected: false});
}

chrome.browserAction.onClicked.addListener((tab) => {
  handleOldGithubToken((askToSetToken) => {
    if (askToSetToken) {
      askGithubToken(() => {})
    }
  })
})

informUserAboutGithubTokenFeature()

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse){
      if(request.msg[0] == "openTab") {
        openNewTab(request.msg[1]);
      }
  }
);