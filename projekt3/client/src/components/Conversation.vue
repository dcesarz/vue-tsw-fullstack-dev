<template>
  <div>
    Connected to {{contact}}, enjoy your convo!
    <br />
    <input id="message-input" v-model="messageContent" type="text" placeholder="Message..." />
    <input type="button" @click="newMessage" value="Send message.." />
    <div id="history" v-for="message in mssgs" :key="message._id">
      <div><SingleMessage :message="message" /></div>
    </div>
  </div>
</template>

<script>
import SingleMessage from "./SingleMessage";
import axios from "../axios";
import { mapGetters } from "vuex";
import io from "socket.io-client";

export default {
  name: "Conversation",
  data() {
    return {
      messageContent: "",
      emitter: io(),
      sid: "",
      mssgs: {},
      message: {}
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  props: ["filteredMessages", "contact"],
  components: {
    SingleMessage
  },
  methods: {
    filterWithUsername(a) {
      const search = a.sender === this.contact || a.recipent === this.contact;
      const current =
        a.sender === this.currentUser.username ||
        a.recipent === this.currentUser.username;
      if (search && current) return true;
      else return false;
    },
    findUserConvo() {
      axios
        .get(`${location.origin}/api/messages/inbox`, { withCredentials: true })
        .then(resp => {
          const unfiltered = resp.data;
          const filtered = unfiltered.filter(this.filterWithUsername);
          this.filteredMessages = filtered;
        })
        .catch(err => {
          this.filteredMessages = null;
          console.log(err);
        });
    },
    async newMessage() {
      const formData = {
        sender: this.currentUser.username,
        recipent: this.contact,
        content: this.messageContent
      };
      await axios
        .post(`${location.origin}/api/messages/new`, formData, {
          withCredentials: true
        })
        .then(res => {
          let data = {
            sender: res.data.sender,
            recipent: res.data.recipent,
            content: res.data.content,
            sid: this.sid
          };
          this.message = res.data;
          this.emitter.emit("chatMessage", data);
        })
        .catch(err => {
          alert(err);
        });
    }
  },
  created() {
    this.mssgs = this.filteredMessages;
    window.onbeforeunload = function() {
      this.emitter.emit("leave", {
        id: this.sid
      });
    };
    this.emitter.on("message", message => {
      console.log(message);
      this.sid = this.emitter.id;
      let obj = {
        sender: this.currentUser.username,
        recipent: this.contact,
        sid: this.sid
      };
      this.emitter.emit("establish", obj);
    });
    this.emitter.on("chatMessage", message => {
      this.findUserConvo();
      console.log(message);
      this.mssgs.push(this.message);
    });
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
