<template>
  <div class="register">
    <h2>Register</h2>
    <hr>
    <form @submit.prevent="handleSubmit()">
      <input v-model="user.username" type="text" name="username" id="username"
      placeholder="Username" minLength="3" required="">
      <br><br>
      <input v-model="user.password" type="password" name="password" id="password"
      placeholder="Password" required="">
      <br><br>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from '../axios';
export default {
  name: 'Register',
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    handleSubmit() {
      axios
      //${location.origin}/api/users/register
      //`https://localhost:3000/api/users/register`
        .post(`${location.origin}/api/users/register`, this.user)
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
