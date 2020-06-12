<!-- WILL SHOW ALL AUCTIONS. -->
<template>
  <div>
    <h1>Hello {{currentUser.username}}! Here's list of current auctions...</h1>
    <table>
      <div v-for="auction in auctions" :key="auction._id">
        <Auction :auction="auction" />
      </div>
    </table>
  </div>
</template>

<script>
import axios from "../axios";
import Auction from "./Auction";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      auctions: {}
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  components: {
    Auction,
  },
  methods: {
    loadAuctions() {
      axios.get(
        `${location.origin}/api/auctions`,
        { withCredentials: true }
      ).then(resp => {
        console.log(resp);
        this.auctions = resp.data;
      })
    }
  },
  created () {
    this.loadAuctions();
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
