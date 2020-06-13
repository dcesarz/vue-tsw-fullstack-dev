<!-- WILL SHOW ALL AUCTIONS. -->
<template>
  <div>
    <h1>Hello {{currentUser.username}}! Here's list of your auctions...</h1>
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
  name: "MyAuctions",
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
    filterWithUsername(a) {
      const isSeller = a.seller === this.currentUser.username;
      const isOpen = (a.status === "onSale") || (a.status === "new");
      if (isSeller && isOpen) return true;
      else return false;
    },
    loadAuctions() {
      axios.get(
        `${location.origin}/api/auctions`,
        { withCredentials: true }
      ).then(resp => {
        const unfiltered = resp.data;
        const filtered = unfiltered.filter(this.filterWithUsername);
        console.log(filtered);
        this.auctions = filtered;
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
