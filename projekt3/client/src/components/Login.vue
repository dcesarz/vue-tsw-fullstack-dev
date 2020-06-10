<template>
  <div class="login">
    <h2>Log in</h2>
    <hr>
      <form @submit.prevent="handleSubmit" ref="form">
        <input v-model="formData.username" type="text" name="username" id="username"
        placeholder="Username" minLength="3" required="">
        <br><br>
        <input v-model="formData.password" type="password" name="password" id="password"
        placeholder="Password" required="">
        <br><br>
        <button type="submit">Log in</button>
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
        .post(`https://localhost:3000/api/users/login`, this.formData)
        .then((res) => {
          console.log(res);
          this.$router.push('/');
        })
        .catch((err) => {
          console.log(err);
          location.reload();
        });
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
