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


<style>
@import '../assets/style.css';
</style>