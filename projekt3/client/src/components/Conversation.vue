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
      mssgs: [],
      message: {},
      conversation: null
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  props: ["filteredMessages", "contact", "room"],
  components: {
    SingleMessage
  },
  methods: {
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
            _id: this.room._id
          };
          this.emitter.emit("chatMessage", data);
        })
        .catch(err => {
          alert(err);
        });
    }
  },
  created() {
    this.mssgs = this.filteredMessages;
    this.emitter.emit("join", {
      _id : this.room._id
    }
    );
    this.emitter.on("chatMessage", message=> {
      this.mssgs.push(message);
    })

  }
};
</script>


<style>
@import '../assets/style.css';
</style>