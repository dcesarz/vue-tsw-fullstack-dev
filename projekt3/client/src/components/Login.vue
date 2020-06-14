<template>
  <div class="login">
    <h2>Log in</h2>
    <hr>
      <form class="form-card" @submit.prevent="handleSubmit" ref="form">
        <input class="form-text" v-model="formData.username" type="text" name="username" id="username"
        placeholder="Username" minLength="3" required="">
        <br><br>
        <input class="form-text" v-model="formData.password" type="password" name="password" id="password"
        placeholder="Password" required="">
        <br><br>
        <button class="white-button" type="submit">Log in</button>
      </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from '../axios';

export default {
  name: 'Login',
  data() {
    return {
      formData: {
        username: '',
        password: '',
      },
    };
  },
  computed: {
    ...mapGetters(['currentUser']),
  },
  methods: {
    ...mapActions(['fetchCurrentUser']),
    async handleSubmit() {
      axios
      //`https://localhost:3000/api/users/login`
      //${location.origin}/api/users/login
        .post(`${location.origin}/api/users/login`, this.formData)
        .then((res) => {
          console.log(res);
          this.$router.push("/page/1");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  }
};
</script>


<style>
@import '../assets/style.css';
</style>