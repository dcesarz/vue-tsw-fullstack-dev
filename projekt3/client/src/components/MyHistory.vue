<template>
  <div>
    Hello {{currentUser.username}}! Here's your history of ended auctions you've took part in or won..
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
  name: "MyHistory",
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
      const isSeller = a.seller === this.currentUser.username;
      const isBidder = a.bidders.includes(this.currentUser.username);
      const isLatestBidder = a.latestBidder === this.currentUser.username;
      const isOver = a.status === "sold" || a.status === "notSold";
      if ((isSeller || isBidder || isLatestBidder) && isOver) return true;
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
