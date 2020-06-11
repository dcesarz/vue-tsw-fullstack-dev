<template>
  <div>
    <div id="message-box">
      <h2>{{message.sender}}</h2>
      <div>{{message.content}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SingleMessage",
  props: ["message"],
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
};
</script>

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
#message-box {
  padding: 5px;
  border-style: solid;
  border-color: black;
  border-width: 1px;
}
</style>
