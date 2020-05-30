
<template>
  <div class="register-form">
    <h4>Register</h4>
    <form ref="form">
      <label>Username</label>
      <br />
      <input type="text" name="username" v-model="username" required />
      <br />
      <label>Password</label>
      <br />
      <input type="password" name="password" v-model="password" required />
      <br />
      <input type="button" @click="register" value="Submit" />
      <br />
      <input type="button" @click="clear" value="Clear" />
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  computed: {
    ...mapGetters(['error']),
  },
  methods: {
    ...mapActions(['register', 'logError']),
    async register() {
      const user = {
        username: this.username,
        password: this.password,
      };
      axios
        .post('/api/api/users', user, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        })
        .then(() => {
          this.$swal('Registered user', 'Ok', 'success');
          this.$router.push({ name: 'Home' });
          this.clear();
        })
        .catch((error) => {
          this.logError(error);
          this.$swal('Error', `${error}`, 'error');
        });
    },
    clear() {
      this.$refs.form.reset();
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
