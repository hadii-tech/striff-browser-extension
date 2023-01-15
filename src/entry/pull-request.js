const GREEN_CHECK_MARK =
  '<svg style="color:#00bd43;float: left;margin-top: 1px;margin-left:-2px;margin-right: 5px;display:block;" class="octicon octicon-check-circle-fill flex-shrink-0 " title="This step passed" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" style="color: #7dffc9;"><path fill-rule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zm3.78-9.72a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z"></path></svg>';

window.addEventListener("load", main, false);

function main() {
  let repoURI = window.location.pathname.substring(1);
  if (
    repoURI.match(/.*\/pull\/[0-9]*/) &&
    window.location.href.includes("github.com")
  ) {
    // Current page is GitHub Pull Request, retrieve important values
    var repoOwner = window.location.pathname.split("/")[1];
    var repoName = window.location.pathname.split("/")[2];
    var pullNo = window.location.pathname.split("/")[4];
    // Create striff button
    if (document.getElementsByClassName("tabnav-tabs")) {
      var striffTabNav = document.getElementById("striffTabNav");
      if (striffTabNav == null) {
        var ghTabNavs = document.getElementsByClassName("tabnav-tabs")[0];
        var imageURL = chrome.runtime.getURL("assets/logo.png");
        ghTabNavs.innerHTML +=
          '<button type="submit" class="btn btn-sm btn-with-count js-toggler-target" aria-label="View striff diagrams for this pull request." title="View striff diagrams for this pull request." id="striff_btn" style="margin-left: 15px;padding-left: 5px; min-width:110px; padding-right:15px; overflow: hidden; border-radius: 5px; margin-bottom: 10px; margin-top: 7px; background-color: #f3f3f3; float: right; margin-left: auto;"> <div id="striff_btn_div" style="margin-right: 5px; margin-left: 5px;"><div id="striff_btn_icon_div"><img style="float:left; display:block; margin-top: 2px;margin-bottom: -2px;margin-right: 5px;" id="structure_diff_btn_img" src="' +
          imageURL +
          '"></div><span style="padding-right: 5px;" id="striff_btn_text">Striff Report</span></div></button>';
      }
      // create event listener for the structure-diff button
      var striffBtn = document.getElementById("striff_btn");
      striffBtn.addEventListener("click", function () {
        chrome.runtime.sendMessage({ msg: ["getToken"] }, function (token) {
          if (token) {
            displayStriffs(repoOwner, repoName, pullNo, token);
          } else {
            alert(
              "The striff extension requires a GitHub token to read and analyze your code. Please click on the striff extension icon to set one."
            );
          }
        });
      });
    }
  }
}

function showSuccessBtnIcon() {
  var imageHolder = document.getElementById("striff_btn_icon_div");
  imageHolder.innerHTML = GREEN_CHECK_MARK;
}

function getGHHostName() {
  if (window.location.hostname === "github.com") {
    return "api.github.com";
  } else {
    // User is using GitHub enterprise
    return window.location.hostname;
  }
}

function displayStriffs(repoOwner, repoName, pullNo, token) {
  chrome.runtime.sendMessage({
    msg: [
      "openStriffWindow",
      {
        repoOwner: repoOwner,
        repoName: repoName,
        pullNo: pullNo,
        token: token,
        ghHost: getGHHostName(),
      },
    ],
  });
  showSuccessBtnIcon();
}
