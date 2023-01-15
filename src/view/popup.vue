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
  </head>
  <body>
    <form>
      <div class="form-group">
        <label for="OAuthToken">GitHub OAuth Token</label>
        <input
          type="text"
          v-model="OAuthToken"
          class="form-control"
          placeholder="Token"
          id="OAuthToken"
        />
        <small id="tokenHelp" class="form-text text-muted"
          >Follow
          <a target="_blank" href="https://bit.ly/2Opyb7E">this guide</a> to
          create a token. This extension requires
          <b>read permissions</b> only.</small
        >
        <button id="submitBtn" @click="save" class="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  </body>
</template>

<script>
export default {
  name: "popupView",
  data() {
    return {
      OAuthToken: null,
    };
  },
  mounted() {
    let self = this;
    chrome.runtime.sendMessage({ msg: ["getToken"] }, function (response) {
      self.OAuthToken = response;
    });
  },
  methods: {
    save() {
      chrome.runtime.sendMessage({ msg: ["setToken", this.OAuthToken] });
      window.close();
    },
  },
}
</script>

<style scoped>
.form-group {
  width: 300px;
  padding: 20px;
  margin-bottom: 0rem;
}

#submitBtn {
  margin-top: 15px;
}
</style>
