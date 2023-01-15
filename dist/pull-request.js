/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************************!*\
  !*** ./src/entry/pull-request.js ***!
  \***********************************/
const GREEN_CHECK_MARK = '<svg style="color:#00bd43;float: left;margin-top: 1px;margin-left:-2px;margin-right: 5px;display:block;" class="octicon octicon-check-circle-fill flex-shrink-0 " title="This step passed" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" style="color: #7dffc9;"><path fill-rule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zm3.78-9.72a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z"></path></svg>';
window.addEventListener("load", main, false);
function main() {
  let repoURI = window.location.pathname.substring(1);
  if (repoURI.match(/.*\/pull\/[0-9]*/) && window.location.href.includes("github.com")) {
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
        ghTabNavs.innerHTML += '<button type="submit" class="btn btn-sm btn-with-count js-toggler-target" aria-label="View striff diagrams for this pull request." title="View striff diagrams for this pull request." id="striff_btn" style="margin-left: 15px;padding-left: 5px; min-width:110px; padding-right:15px; overflow: hidden; border-radius: 5px; margin-bottom: 10px; margin-top: 7px; background-color: #f3f3f3; float: right; margin-left: auto;"> <div id="striff_btn_div" style="margin-right: 5px; margin-left: 5px;"><div id="striff_btn_icon_div"><img style="float:left; display:block; margin-top: 2px;margin-bottom: -2px;margin-right: 5px;" id="structure_diff_btn_img" src="' + imageURL + '"></div><span style="padding-right: 5px;" id="striff_btn_text">Striff Report</span></div></button>';
      }
      // create event listener for the structure-diff button
      var striffBtn = document.getElementById("striff_btn");
      striffBtn.addEventListener("click", function () {
        chrome.runtime.sendMessage({
          msg: ["getToken"]
        }, function (token) {
          if (token) {
            displayStriffs(repoOwner, repoName, pullNo, token);
          } else {
            alert("The striff extension requires a GitHub token to read and analyze your code. Please click on the striff extension icon to set one.");
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
    msg: ["openStriffWindow", {
      repoOwner: repoOwner,
      repoName: repoName,
      pullNo: pullNo,
      token: token,
      ghHost: getGHHostName()
    }]
  });
  showSuccessBtnIcon();
}
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UyxFQUFFQSxTQUFTO01BQ3BCRSxRQUFRLEVBQUVBLFFBQVE7TUFDbEJDLE1BQU0sRUFBRUEsTUFBTTtNQUNkYyxLQUFLLEVBQUVBLEtBQUs7TUFDWk8sTUFBTSxFQUFFRixhQUFhO0lBQ3ZCLENBQUM7RUFFTCxDQUFDLENBQUM7RUFDRkYsa0JBQWtCLEVBQUU7QUFDdEIsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3N0cmlmZi1icm93c2VyLWV4dGVuc2lvbi8uL3NyYy9lbnRyeS9wdWxsLXJlcXVlc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgR1JFRU5fQ0hFQ0tfTUFSSyA9XG4gICc8c3ZnIHN0eWxlPVwiY29sb3I6IzAwYmQ0MztmbG9hdDogbGVmdDttYXJnaW4tdG9wOiAxcHg7bWFyZ2luLWxlZnQ6LTJweDttYXJnaW4tcmlnaHQ6IDVweDtkaXNwbGF5OmJsb2NrO1wiIGNsYXNzPVwib2N0aWNvbiBvY3RpY29uLWNoZWNrLWNpcmNsZS1maWxsIGZsZXgtc2hyaW5rLTAgXCIgdGl0bGU9XCJUaGlzIHN0ZXAgcGFzc2VkXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiIHZlcnNpb249XCIxLjFcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT1cImNvbG9yOiAjN2RmZmM5O1wiPjxwYXRoIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBkPVwiTTggMTZBOCA4IDAgMTA4IDBhOCA4IDAgMDAwIDE2em0zLjc4LTkuNzJhLjc1Ljc1IDAgMDAtMS4wNi0xLjA2TDYuNzUgOS4xOSA1LjI4IDcuNzJhLjc1Ljc1IDAgMDAtMS4wNiAxLjA2bDIgMmEuNzUuNzUgMCAwMDEuMDYgMGw0LjUtNC41elwiPjwvcGF0aD48L3N2Zz4nO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbWFpbiwgZmFsc2UpO1xuXG5mdW5jdGlvbiBtYWluKCkge1xuICBsZXQgcmVwb1VSSSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zdWJzdHJpbmcoMSk7XG4gIGlmIChcbiAgICByZXBvVVJJLm1hdGNoKC8uKlxcL3B1bGxcXC9bMC05XSovKSAmJlxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiZ2l0aHViLmNvbVwiKVxuICApIHtcbiAgICAvLyBDdXJyZW50IHBhZ2UgaXMgR2l0SHViIFB1bGwgUmVxdWVzdCwgcmV0cmlldmUgaW1wb3J0YW50IHZhbHVlc1xuICAgIHZhciByZXBvT3duZXIgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoXCIvXCIpWzFdO1xuICAgIHZhciByZXBvTmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdChcIi9cIilbMl07XG4gICAgdmFyIHB1bGxObyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdChcIi9cIilbNF07XG4gICAgLy8gQ3JlYXRlIHN0cmlmZiBidXR0b25cbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRhYm5hdi10YWJzXCIpKSB7XG4gICAgICB2YXIgc3RyaWZmVGFiTmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHJpZmZUYWJOYXZcIik7XG4gICAgICBpZiAoc3RyaWZmVGFiTmF2ID09IG51bGwpIHtcbiAgICAgICAgdmFyIGdoVGFiTmF2cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0YWJuYXYtdGFic1wiKVswXTtcbiAgICAgICAgdmFyIGltYWdlVVJMID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwiYXNzZXRzL2xvZ28ucG5nXCIpO1xuICAgICAgICBnaFRhYk5hdnMuaW5uZXJIVE1MICs9XG4gICAgICAgICAgJzxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1zbSBidG4td2l0aC1jb3VudCBqcy10b2dnbGVyLXRhcmdldFwiIGFyaWEtbGFiZWw9XCJWaWV3IHN0cmlmZiBkaWFncmFtcyBmb3IgdGhpcyBwdWxsIHJlcXVlc3QuXCIgdGl0bGU9XCJWaWV3IHN0cmlmZiBkaWFncmFtcyBmb3IgdGhpcyBwdWxsIHJlcXVlc3QuXCIgaWQ9XCJzdHJpZmZfYnRuXCIgc3R5bGU9XCJtYXJnaW4tbGVmdDogMTVweDtwYWRkaW5nLWxlZnQ6IDVweDsgbWluLXdpZHRoOjExMHB4OyBwYWRkaW5nLXJpZ2h0OjE1cHg7IG92ZXJmbG93OiBoaWRkZW47IGJvcmRlci1yYWRpdXM6IDVweDsgbWFyZ2luLWJvdHRvbTogMTBweDsgbWFyZ2luLXRvcDogN3B4OyBiYWNrZ3JvdW5kLWNvbG9yOiAjZjNmM2YzOyBmbG9hdDogcmlnaHQ7IG1hcmdpbi1sZWZ0OiBhdXRvO1wiPiA8ZGl2IGlkPVwic3RyaWZmX2J0bl9kaXZcIiBzdHlsZT1cIm1hcmdpbi1yaWdodDogNXB4OyBtYXJnaW4tbGVmdDogNXB4O1wiPjxkaXYgaWQ9XCJzdHJpZmZfYnRuX2ljb25fZGl2XCI+PGltZyBzdHlsZT1cImZsb2F0OmxlZnQ7IGRpc3BsYXk6YmxvY2s7IG1hcmdpbi10b3A6IDJweDttYXJnaW4tYm90dG9tOiAtMnB4O21hcmdpbi1yaWdodDogNXB4O1wiIGlkPVwic3RydWN0dXJlX2RpZmZfYnRuX2ltZ1wiIHNyYz1cIicgK1xuICAgICAgICAgIGltYWdlVVJMICtcbiAgICAgICAgICAnXCI+PC9kaXY+PHNwYW4gc3R5bGU9XCJwYWRkaW5nLXJpZ2h0OiA1cHg7XCIgaWQ9XCJzdHJpZmZfYnRuX3RleHRcIj5TdHJpZmYgUmVwb3J0PC9zcGFuPjwvZGl2PjwvYnV0dG9uPic7XG4gICAgICB9XG4gICAgICAvLyBjcmVhdGUgZXZlbnQgbGlzdGVuZXIgZm9yIHRoZSBzdHJ1Y3R1cmUtZGlmZiBidXR0b25cbiAgICAgIHZhciBzdHJpZmZCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0cmlmZl9idG5cIik7XG4gICAgICBzdHJpZmZCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyBtc2c6IFtcImdldFRva2VuXCJdIH0sIGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgZGlzcGxheVN0cmlmZnMocmVwb093bmVyLCByZXBvTmFtZSwgcHVsbE5vLCB0b2tlbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KFxuICAgICAgICAgICAgICBcIlRoZSBzdHJpZmYgZXh0ZW5zaW9uIHJlcXVpcmVzIGEgR2l0SHViIHRva2VuIHRvIHJlYWQgYW5kIGFuYWx5emUgeW91ciBjb2RlLiBQbGVhc2UgY2xpY2sgb24gdGhlIHN0cmlmZiBleHRlbnNpb24gaWNvbiB0byBzZXQgb25lLlwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2hvd1N1Y2Nlc3NCdG5JY29uKCkge1xuICB2YXIgaW1hZ2VIb2xkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0cmlmZl9idG5faWNvbl9kaXZcIik7XG4gIGltYWdlSG9sZGVyLmlubmVySFRNTCA9IEdSRUVOX0NIRUNLX01BUks7XG59XG5cbmZ1bmN0aW9uIGdldEdISG9zdE5hbWUoKSB7XG4gIGlmICh3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgPT09IFwiZ2l0aHViLmNvbVwiKSB7XG4gICAgcmV0dXJuIFwiYXBpLmdpdGh1Yi5jb21cIjtcbiAgfSBlbHNlIHtcbiAgICAvLyBVc2VyIGlzIHVzaW5nIEdpdEh1YiBlbnRlcnByaXNlXG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkaXNwbGF5U3RyaWZmcyhyZXBvT3duZXIsIHJlcG9OYW1lLCBwdWxsTm8sIHRva2VuKSB7XG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICBtc2c6IFtcbiAgICAgIFwib3BlblN0cmlmZldpbmRvd1wiLFxuICAgICAge1xuICAgICAgICByZXBvT3duZXI6IHJlcG9Pd25lcixcbiAgICAgICAgcmVwb05hbWU6IHJlcG9OYW1lLFxuICAgICAgICBwdWxsTm86IHB1bGxObyxcbiAgICAgICAgdG9rZW46IHRva2VuLFxuICAgICAgICBnaEhvc3Q6IGdldEdISG9zdE5hbWUoKSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG4gIHNob3dTdWNjZXNzQnRuSWNvbigpO1xufVxuIl0sIm5hbWVzIjpbIkdSRUVOX0NIRUNLX01BUksiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwibWFpbiIsInJlcG9VUkkiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwic3Vic3RyaW5nIiwibWF0Y2giLCJocmVmIiwiaW5jbHVkZXMiLCJyZXBvT3duZXIiLCJzcGxpdCIsInJlcG9OYW1lIiwicHVsbE5vIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwic3RyaWZmVGFiTmF2IiwiZ2V0RWxlbWVudEJ5SWQiLCJnaFRhYk5hdnMiLCJpbWFnZVVSTCIsImNocm9tZSIsInJ1bnRpbWUiLCJnZXRVUkwiLCJpbm5lckhUTUwiLCJzdHJpZmZCdG4iLCJzZW5kTWVzc2FnZSIsIm1zZyIsInRva2VuIiwiZGlzcGxheVN0cmlmZnMiLCJhbGVydCIsInNob3dTdWNjZXNzQnRuSWNvbiIsImltYWdlSG9sZGVyIiwiZ2V0R0hIb3N0TmFtZSIsImhvc3RuYW1lIiwiZ2hIb3N0Il0sInNvdXJjZVJvb3QiOiIifQ==