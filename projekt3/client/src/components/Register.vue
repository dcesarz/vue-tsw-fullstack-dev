<template>
  <div class="register">
    <h2>Register</h2>
    <hr>
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
      <button v-if="!($v.$invalid)" class="white-button" type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from '../axios';
const { required, minLength } = require("vuelidate/lib/validators");

export default {
  name: 'Register',
  data() {
    return {
      formData: {
        username: '',
        password: '',
      },
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
  methods: {
    handleSubmit() {
      axios
      //${location.origin}/api/users/register
      //`https://localhost:3000/api/users/register`
        .post(`${location.origin}/api/users/register`, this.formData)
        .then(() => {
           this.$router.push({ name: "Login" });
        })
        .catch((err) => {
          // eslint-disable-next-line
          console.log(err);
        });
    },
  },
};
</script>


<style>
@import '../assets/style.css';
</style>