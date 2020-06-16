<template>
  <div class="login">
    <h2>Log in</h2>
    <hr />
    <form class="form-card" @submit.prevent="handleSubmit" ref="form">
      <label
        v-if="$v.formData.username.$invalid && $v.formData.username.$dirty"
        class="warning-label"
        for="date-input"
      >Login cannot be empty or shorter than 3 characters!</label>
      <br />
      <input
        @input="$v.$touch()"
        class="form-text"
        v-model="formData.username"
        type="text"
        name="username"
        id="username"
        placeholder="Username"
        maxlength="30"
        minlength="3"
        required
      />
      <br />
      <br />
      <label
        v-if="$v.formData.password.$invalid && $v.formData.password.$dirty"
        class="warning-label"
        for="date-input"
      >Password cannot be empty or shorter than 3 characters!</label>
      <br />
      <input
        @input="$v.$touch()"
        class="form-text"
        v-model="formData.password"
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        maxlength="30"
        required
      />
      <br />
      <br />
      <button v-if="!($v.$invalid)" class="white-button" type="submit">Log in</button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "../axios";
const { required, minLength } = require("vuelidate/lib/validators");

export default {
  name: "Login",
  data() {
    return {
      formData: {
        username: "",
        password: ""
      }
    };
  },
  validations: {
    formData: {
      username: {
        required,
        minLength: minLength(3)
      },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  computed: {
    ...mapGetters(["currentUser"])
  },
  methods: {
    ...mapActions(["fetchCurrentUser"]),
    async handleSubmit() {
      await axios
        .post(`${location.origin}/api/users/login`, this.formData)
        .then(res => {
          console.log(res);
          this.$store.dispatch("commitConnectSocket");
          this.$store.getters.socket.emit("joinUser", {
            _id: this.$store.getters.currentUser._id
          });
          this.$router.push("/page/1");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>


<style>
@import "../assets/style.css";
</style>