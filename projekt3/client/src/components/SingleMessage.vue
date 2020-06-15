<template>
  <div>
    <div class="message-box">
      <h2 v-bind:class="headerClass">{{message.sender}}</h2>
      <div>{{message.content}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SingleMessage",
  props: ["message"],
  data(){
    return{
      headerClass: ""
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  created(){
    if(this.message.sender === this.currentUser.username)
    {
      this.headerClass = "currentUserSender";
    }
    else
    {
      this.headerClass = "otherUserSender";
    }
  }
};
</script>


<style>
@import '../assets/style.css';
</style>