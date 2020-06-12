<template>
  <div>
    <h1>Hello {{currentUser.username}}! Here's list of auctions you've bidded on and are still open...</h1>
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
  name: "MyBids",
  data() {
    return {
      auctions: {}
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  components: {
    Auction
  },
  methods: {
    filterWithUsername(a) {
      const isBidder = a.bidders.includes(this.currentUser.username);
      const isLatestBidder = a.latestBidder === this.currentUser.username;
      const isOpen = a.status === "onSale";
      if ((isLatestBidder || isBidder) && isOpen) return true;
      else return false;
    },
    loadAuctions() {
      axios
        .get("https://localhost:3000/api/auctions", { withCredentials: true })
        .then(resp => {
          const unfiltered = resp.data;
          const filtered = unfiltered.filter(this.filterWithUsername);
          console.log(filtered);
          this.auctions = filtered;
        });
    }
  },
  created() {
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
