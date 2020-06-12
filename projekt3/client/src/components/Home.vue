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
     filterOpen(a) {
      const isOpen = a.status === "onSale";
      if (isOpen) return true;
      else return false;
    },
    loadAuctions() {
      axios.get(
        `${location.origin}/api/auctions`,
        { withCredentials: true }
      ).then(resp => {
        const unfiltered = resp.data;
        const filtered = unfiltered.filter(this.filterOpen);
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
