<template>
    <div>
        <h2>Login</h2>
        <form v-on:submit="login">
            <input type="text" name="username" /><br>
            <input type="password" name="password" /><br>
            <input type="submit" value="Login" />
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import router from '../router';

export default {
  name: 'Login',
  methods: {
    login: (e) => {
      e.preventDefault();
      const username = 'username';
      const password = 'password';
      const login = () => {
        const data = {
          username,
          password,
        };
        axios.post('/api/login', data)
        // eslint-disable-next-line
          .then((response) => {
            // eslint-disable-next-line
            console.log('Logged in');
            router.push('/');
          })
          // eslint-disable-next-line
          .catch((errors) => {
            // eslint-disable-next-line
            console.log('Cannot log in');
          });
      };
      login();
    },
  },
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
