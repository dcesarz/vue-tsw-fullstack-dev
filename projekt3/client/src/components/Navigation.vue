<template>
<div>
  <div>
    <h1>Welcome to Auction app!</h1>
  </div>
  <ul>
    <li>
    <li v-if="isAuthenticated">
    <router-link to="/new">New auction</router-link>
      </li>
    <li v-if="isAuthenticated">
    <router-link to="/">Home</router-link>
      </li>
    <li v-if="!isAuthenticated">
    <router-link to="/login">Login</router-link>
      </li>
    <li v-if="!isAuthenticated">
      <router-link to="/register">Register</router-link>
      </li>
    <li v-if="isAuthenticated">
      <a @click="logout()">Log out</a>
      </li>
<!--    <li v-if="currentUser.isAuthenticated" class="nav-item">
      <router-link to="/my-bids/page/1">My bids</router-link>
    </li>
      <li v-if="currentUser.isAuthenticated" class="nav-item">
    <router-link to="/my-auctions/page/1">My offers</router-link>
      </li>
    <li v-if="currentUser.isAuthenticated" class="nav-item">
      <router-link to="/my-history/page/1">My History</router-link>
      </li> -->
  </ul>
</div>
</template>

<script>
import axios from '../axios';
// import router from "../router";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "Navigation",
    computed: mapGetters(['isAuthenticated']),
    methods: {
        ...mapActions(["fetchCurrentUser"]),
        logout () {
            axios
            //${location.origin}/api/users/logout
            //https://localhost:3000/api/users/logout
                .get(`https://localhost:3000/api/users/logout`)
                .then(() => {
                    // router.push("/"); // uncaught exception error          
                    this.$router.push('/login');
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
