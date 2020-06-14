<template>
<div>
  <ul id="nav">
    <li v-if="isAuthenticated">
    <router-link class="nav-link" to="/new">New auction</router-link>
      </li>
    <li>
    <router-link class="nav-link" to="/page/1">Home</router-link>
    </li>
    <li v-if="!isAuthenticated">
    <router-link class="nav-link" to="/login">Login</router-link>
      </li>
    <li v-if="!isAuthenticated">
      <router-link class="nav-link" to="/register">Register</router-link>
      </li>
    <li v-if="isAuthenticated">
      <router-link class="nav-link" to="/inbox">Inbox</router-link>
    </li>
    <li v-if="isAuthenticated">
      <a @click="logout()">Log out</a>
      </li>
     <li v-if="isAuthenticated">
    <router-link class="nav-link" to="/my-auctions/page/1">My auctions</router-link>
    </li>
     <li v-if="isAuthenticated">
      <router-link class="nav-link" to="/my-bids/page/1">My bids</router-link>
      </li>
    <li v-if="isAuthenticated">
      <router-link class="nav-link" to="/my-history/page/1">My History</router-link>
      </li> 
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
                .get(`${location.origin}/api/users/logout`)
                .then(() => {
                     this.$router.push({ name: "Login" });
                })
                .catch((err) => {
                    console.log(err);
                    // location.reload();
                });
        }
    }
};
</script>

<style>
@import '../assets/style.css';
</style>