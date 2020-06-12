<!-- WILL SHOW SINGLE AUCTION. -->
<template>
  <div>
    <label for="name-input">Get to convo!:</label>
    <input id="name-input" type="text" v-model="usrSearch" placeholder="Username..." />
    <br />
    <br />
    <input type="button" @click="findUserConvo" value="Search for user.." />
    <br />
    <br />
    <Conversation v-if="renderConvo" :filteredMessages="filteredMessages" :contact="usernameSearch"/>
  </div>
</template>

<script>
import Conversation from "./Conversation";
import { mapGetters } from "vuex";
import axios from '../axios'

export default {
  name: "Inbox",
  components: {
    Conversation
  },
  data() {
    return {
       messages: {},
       renderConvo: false,
       usrSearch: ""
    };
  },
  props:
      ["filteredMessages", "usernameSearch"]
  ,
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  methods: {
      filterWithUsername(a){
          const search = a.sender === this.usrSearch || a.recipent === this.usrSearch;
          const current = a.sender === this.currentUser.username || a.recipent === this.currentUser.username;
          if(search && current) return true;
          else return false;
      },
      findUserConvo(){
        axios.get(
            `${location.origin}/api/messages/inbox`,
            { withCredentials: true }
        ).then(resp => {
            const unfiltered = resp.data;
            this.usernameSearch = this.usrSearch;
            const filtered = unfiltered.filter(this.filterWithUsername)
            this.filteredMessages = filtered;
            this.renderConvo = true;
        })
        .catch((err) => {
          this.usernameSearch = this.usrSearch;
          this.filteredMessages = null;
          this.renderConvo = true;
          console.log(err);
        });
      },
  }
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
</style>
