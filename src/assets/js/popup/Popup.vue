<template>
  <div>
    <div v-if="userLoggedIn" class="main">
      <div class="logged-in">
        <h2>Welcome</h2>
      </div>
      <div class="logged-in-as">
        <span>Singed in as</span>
        <h3>{{ user.currentUser.email }}</h3>
      </div>
      <button class="logout-button" @click="logout">LOGOUT</button>
    </div>
    <div v-else>
      <div class="main">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div class="login">
          <form class="login-form">
            <label for="chk" aria-hidden="true">Login</label>
            <input
              type="email"
              name="email"
              v-model="loginForm.email"
              placeholder="Email"
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
              :class="{ 'login-button': true, loading: isLoading }"
              @click="login"
              type="button"
              :disabled="isLoading"
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
import axios from "axios";
export default {
  data: () => ({
    user: {
      currentUser: "",
      accessToken: "",
    },
    isLoading: false,
    loginForm: {
      email: "",
      password: "",
    },
    errors: "",
  }),
  computed: {
    userLoggedIn() {
      return !!this.user?.accessToken;
    },
  },
  created() {
    let localStorageUser = localStorage.getItem("ulangi-translator-user");
    if (localStorageUser) {
      this.user = JSON.parse(localStorageUser);
      this.getMe();
    }
  },
  methods: {
    getMe() {
      axios
        .post(process.env.ULANGI_SERVER + "/check-access-token", {
          accessToken: this.user.accessToken,
        })
        .then((res) => {
          if (res && res.data && !res.data.valid) {
            this.clearUser();
          }
        })
        .catch(() => {
          this.clearUser();
        });
    },
    clearUser() {
      this.user = {
        name: "",
        token: "",
      };
      localStorage.removeItem("ulangi-translator-user");
    },
    afterGetToken(response) {
      if (response && response.token) {
        this.user = JSON.parse(response.token);
      }
    },
    logout() {
      this.clearUser();
    },
    afterLogin(response, success) {
      if (success) {
        localStorage.setItem(
          "ulangi-translator-user",
          JSON.stringify(response)
        );
        this.user = response;
      } else this.errors = response;
    },
    login() {
      this.isLoading = true;
      axios
        .post(process.env.ULANGI_SERVER + "/sign-in", this.loginForm)
        .then((res) => {
          this.afterLogin(res.data, true);
        })
        .catch((err) => this.afterLogin(err.response.data, false))
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>