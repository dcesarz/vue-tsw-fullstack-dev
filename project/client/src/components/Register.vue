<template>
<div>
    <h1>Please log in.</h1>
    <input v-model="message" placeholder="edit me">
    <p>Your login</p>
    <input v-model="message" placeholder="edit me">
    <p>Your password</p>
    <input v-model="message" placeholder="edit me">
    <p>Message is: {{ message }}</p>
    <p>
        <input
        type="submit"
        value="Submit"
        >
     </p>
     <p>No account? Please register a new one!</p>
</div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
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
