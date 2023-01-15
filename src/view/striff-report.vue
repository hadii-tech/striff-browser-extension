<template>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
      crossorigin="anonymous"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css"
    />
  </head>
  <title>Striff Report</title>
  <body>
    <article class="markdown-body">
      <div class="striff">{{ striffValue }}</div>
    </article>
  </body>
</template>

<script>
import { loadScript } from "vue-plugin-load-script";
import * as striffReport from "../entry/striff-report";

export default {
  name: "striffReport",
  data() {
    return {
      OAuthToken: null,
    };
  },
  mounted() {
    loadScript("panzoom.min.js")
      .then(striffReport.getPRInfo)
      .then(striffReport.consumeStriffAPI)
      .then(striffReport.processAPIResp)
      .then(this.displayStriffs)
      .then((response) => console.log(response))
      .catch(function (err) {
        alert(err);
      });
  },
  methods: {
    displayStriffs(striffAPIResp) {
      console.log(striffAPIResp);
    },
    
  },
};
</script>

<style scoped>
div.striff {
  width: 100%;
  height: 95%;
  border: 1px solid #808080a6;
  min-height: 800px;
  cursor: move;
}
article {
  overflow: hidden;
}
@media only screen and (max-width: 600px) {
  body {
    width: 95%;
    padding: 0px;
  }
}
@media only screen and (max-width: 1200px) {
  body {
    margin-left: auto;
    margin-right: auto;
    padding: 10px;
    display: block;
    max-width: 1000px;
    width: 90%;
  }
}
@media only screen and (min-width: 1200px) {
  body {
    margin-left: auto;
    padding: 30px;
    margin-right: auto;
    display: block;
    width: 80%;
  }
}
</style>
