<template>
  <div>
    <div v-if="userLoggedIn" class="main">
      <div class="logged-in">
        <h2>Welcome</h2>
      </div>
      <div class="logged-in-as">
        <span>Singed in as</span>
        <h3>{{ user.username }}</h3>
      </div>
      <button class="logout-button" @click="logout">LOGOUT</button>
      <button class="logout-button" @click="asw">ASW!</button>
    </div>
    <div v-else>
      <div class="main">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div class="login">
          <form class="login-form">
            <label for="chk" aria-hidden="true">Login</label>
            <input
              type="text"
              name="username"
              v-model="loginForm.username"
              placeholder="UserName"
              required=""
            />
            <input
              type="password"
              name="pswd"
              placeholder="Password"
              required=""
              v-model="loginForm.password"
            />
            <button
              :class="{ 'login-button': true }"
              @click="login"
              type="button"
            >
              Login
            </button>
            <div class="errors" v-html="errors"></div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    user: {
      username: "",
      password: "",
    },
    loginForm: {
      username: "",
      password: "",
    },
    errors: "",
  }),
  computed: {
    userLoggedIn() {
      return !!this.user?.username;
    },
  },
  created() {
    chrome.storage.local.get(process.env.LOCAL_STORAGE_KEY).then((result) => {
      if (result.hasOwnProperty(process.env.LOCAL_STORAGE_KEY)) {
        let [username, password] = window
          .atob(result[process.env.LOCAL_STORAGE_KEY])
          .split(":");
        this.user = {
          username,
          password,
        };
      }
    });
  },
  methods: {
    asw() {
      chrome.runtime.sendMessage(
        { type: "popup-to-sw", data: "asw" },
        (response) => {
          console.log(`Received response from service worker: ${response}`);
        }
      );
    },
    logout() {
      this.user = {
        username: "",
        password: "",
      };
      chrome.storage.local.remove(process.env.LOCAL_STORAGE_KEY);
    },
    login() {
      let dataToStore = {};
      dataToStore[process.env.LOCAL_STORAGE_KEY] = window.btoa(
        `${this.loginForm.username}:${this.loginForm.password}`
      );
      chrome.storage.local.set(dataToStore);
      this.user = {
        username: this.loginForm.username,
        password: this.loginForm.password,
      };
    },
  },
};
</script>