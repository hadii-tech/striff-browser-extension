import { createApp } from "vue";
import App from "../view/striff-report.vue";
import LoadScript from "vue-plugin-load-script";

const app = createApp(App);
const STRIFF_API_URL = "http://localhost:8080/v1/github/striffs";

app.use(LoadScript);
app.mount("#app");

export function getPRInfo() {
  return new Promise((Resolve, reject) => {
    chrome.runtime.sendMessage({ msg: ["getPRInfo"] }, function (prInfoObj) {
      if (Object.keys(prInfoObj).length === 0) {
        reject(
          new Error(
            "Oops! An internal error occurred while fetching Pull Request data from GitHub."
          )
        );
      } else {
        Resolve(prInfoObj);
      }
    });
  });
}

export function consumeStriffAPI(prInfoObj) {
  console.log(prInfoObj);
  return new Promise((Resolve, reject) => {
    var striffReqURL =
      STRIFF_API_URL +
      "/owners/" +
      prInfoObj["repoOwner"] +
      "/repos/" +
      prInfoObj["repoName"] +
      "/pulls/" +
      prInfoObj["pullNo"] +
      "?gh_hostname=" +
      prInfoObj["ghHost"];
    const request = new Request(encodeURI(striffReqURL));
    const headerObj = {
      Accept: "application/json",
      Authorization: "token " + prInfoObj["token"],
    };
    console.log(request);
    Resolve(
      fetch(request, {
        method: "GET",
        headers: headerObj,
      })
        .then((response) => response.json())
        .catch(function (err) {
          reject(new Error(err));
        })
    );
  });
}

export function processAPIResp(striffAPIResp) {
  return new Promise((Resolve, reject) => {
    console.log(striffAPIResp);
    if (striffAPIResp.status > 200) {
      reject(new Error(striffAPIResp.body.errorMessage));
    } else if (
      "striffs" in striffAPIResp.body &&
      Object.keys(striffAPIResp.body.striffs).length > 0
    ) {
      Resolve(striffAPIResp.body);
    } else {
      reject(new Error("No structural differences were found."));
    }
  });
}
