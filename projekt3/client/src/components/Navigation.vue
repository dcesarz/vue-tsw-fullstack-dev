<template>
<div>
  <div>
    <h1>Welcome to Auction app!</h1>
  </div>
  <ul>
    <li>
    <li v-if="currentUser.isAuth">
    <router-link to="/auction">Auction form</router-link>
      </li>
    <li v-if="currentUser.isAuth">
    <router-link to="/">Home</router-link>
      </li>
    <li v-if="!currentUser.isAuth">
    <router-link to="/login">Login</router-link>
      </li>
    <li v-if="!currentUser.isAuth">
      <router-link to="/register">Register</router-link>
      </li>
    <li v-if="currentUser.isAuth">
      <a @click="logout()">Log out</a>
      </li>
<!--    <li v-if="currentUser.isAuth" class="nav-item">
      <router-link to="/my-bids/page/1">My bids</router-link>
    </li>
      <li v-if="currentUser.isAuth" class="nav-item">
    <router-link to="/my-auctions/page/1">My offers</router-link>
      </li>
    <li v-if="currentUser.isAuth" class="nav-item">
      <router-link to="/my-history/page/1">My History</router-link>
      </li> -->
  </ul>
</div>
</template>

<script>
import axios from "axios";
// import router from "../router";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "Navigation",
    computed: mapGetters(['currentUser']),
    methods: {
        ...mapActions(["fetchCurrentUser"]),
        logout () {
            axios
                .get("/api/users/logout")
                .then(() => {
                    // router.push("/"); // uncaught exception error
                    location.reload();
                })
                .catch((err) => {
                    console.log(err);
                    // location.reload();
                });
        }
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  background-color:lightslategray;
  padding: 1%;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: white;
  text-decoration: none;
}
</style>
