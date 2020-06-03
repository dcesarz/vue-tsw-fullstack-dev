<template>
    <div>
        <h2>Home</h2>
        <p>Name: {{ user.username }}</p>
    </div>
</template>
<script>
import axios from 'axios';
import router from '../router';

export default {
  name: 'Home',
  data() {
    return {
      user: {
        username: 'Jesse',
        password: 'password',
      },
    };
  },
  methods: {
    getUserData() {
      const self = this;
      axios.get('/api/api/user')
        .then((response) => {
          // eslint-disable-next-line
          console.log(response);
          self.$set(this, 'user', response.data.user);
        })
        .catch((errors) => {
          // eslint-disable-next-line
          console.log(errors);
          router.push('/');
        });
    },
  },
  mounted() {
    this.getUserData();
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
