<!-- WILL SHOW SINGLE AUCTION. -->
<template>
  <div>
    <h1 class="label" for="usr-input">Get to convo!:</h1>
    <br />
    <br />
    <select id="usr-input" v-model="usrSearch">
      <option v-for="user in users" :key="user">{{user}}</option>
    </select>
    <br />
    <br />
    <input
      class="white-button"
      type="button"
      v-if="(usrSearch !== null) && (usrSearch !== '')"
      @click="findUserConvo"
      value="Connect with this user"
    />
    <br />
    <br />
    <Conversation
      :key="rerenderConvo"
      v-if="renderConvo"
      :room="room"
      :filteredMessages="messages"
      :contact="usrSearch"
      :emitter="emitter"
    />
  </div>
</template>

<script>
import Conversation from "./Conversation";
import { mapGetters } from "vuex";
import axios from "../axios";
import io from "socket.io-client";

export default {
  name: "Inbox",
  components: {
    Conversation
  },
  data() {
    return {
      messages: {},
      rerenderConvo: false,
      renderConvo: false,
      usrSearch: "",
      room: null,
      users: [],
      emitter: io()
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  methods: {
    async findUserConvo() {
      await axios
        .post(
          `${location.origin}/api/rooms/find`,
          { user1: this.currentUser.username, user2: this.usrSearch },
          { withCredentials: true }
        )
        .then(async resp => {
          if (resp.data === null) {
            await axios
              .post(
                `${location.origin}/api/rooms/new`,
                {
                  user1: this.currentUser.username,
                  user2: this.usrSearch
                },
                { withCredentials: true }
              )
              .then(resp => {
                this.room = resp.data;
              })
              .catch(err => {
                console.log("Error making a room");
                console.log(err);
              });
          } else {
            this.room = resp.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
      await axios
        .post(
          `${location.origin}/api/messages/room`,
          { user1: this.currentUser.username, user2: this.usrSearch },
          { withCredentials: true }
        )
        .then(resp => {
          console.log("smsmsmssmsm");
          const chat = resp.data;
          this.messages = chat;
          // this.$set(this.messages, chat, chat);
          // this.messages = resp.data;
          this.renderConvo = true;
          this.rerenderConvo = !this.rerenderConvo;
          this.emitter.emit("leave", {
            _id: this.room._id
          });
        });
    }
  },
  async created() {
    await axios
      .get(`${location.origin}/api/users/`, { withCredentials: true })
      .then(resp => {
        this.users = [];
        // eslint-disable-next-line
        for (let [key, value] of Object.entries(resp.data)) {
          if (this.currentUser.username !== value.username) {
            this.users.push(value.username);
          }
        }
      });
  }
};
</script>


<style>
@import "../assets/style.css";
</style>