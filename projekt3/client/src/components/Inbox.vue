<!-- WILL SHOW SINGLE AUCTION. -->
<template>
  <div>
    <label for="usr-input">Get to convo!:</label>
    <br />
    <br />
    <select id="usr-input" v-model="usrSearch">
      <option v-for="user in users" :key="user">{{user}}</option>
    </select>
    <br />
    <br />
    <input
      type="button"
      v-if="(usrSearch !== null) && (usrSearch !== '')"
      @click="findUserConvo"
      value="Connect with this user"
    />
    <br />
    <br />
    <Conversation
      v-if="renderConvo"
      :room="room"
      :filteredMessages="messages"
      :contact="usrSearch"
    />
  </div>
</template>

<script>
import Conversation from "./Conversation";
import { mapGetters } from "vuex";
import axios from "../axios";

export default {
  name: "Inbox",
  components: {
    Conversation
  },
  data() {
    return {
      messages: {},
      renderConvo: false,
      usrSearch: "",
      room: null,
      users: []
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
        .then(resp => {
          console.dir(resp.data);
          if (resp.data === null) {
            axios
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
          console.log("there shouldnt be an error here");
          console.log(err);
        });
      axios
        .post(
          `${location.origin}/api/messages/room`,
          { user1: this.currentUser.username, user2: this.usrSearch },
          { withCredentials: true }
        )
        .then(resp => {
          this.messages = resp.data;
          this.renderConvo = true;
        });
    }
  },
  async created() {
    console.log("here");
    console.log(this.usrSearch);
    await axios
      .get(`${location.origin}/api/users/`, { withCredentials: true })
      .then(resp => {
        this.users = [];
        for (let [key, value] of Object.entries(resp.data)) {
          console.log(`${key}: ${value.username}`);
          console.log(this.currentUser.username);
          console.log(value.username);
          if (this.currentUser.username !== value.username) {
            this.users.push(value.username);
          }
        }
        console.log(this.users);
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
