<!-- WILL SHOW ALL AUCTIONS. -->
<template>
  <div>
    Hello {{currentUser.username}}! Here's list of your auctions...
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
    loadAuctions() {
      //let loadedAuctions = [];
      console.log("well attempt was made");
      axios.get(
        "https://localhost:3000/api/auctions",
        { withCredentials: true }
      ).then(resp => {
        //const thing = resp.data.filter(auction)
        const unfiltered = resp.data;
        const filtered = unfiltered.filter(auction => auction.seller === this.currentUser.username);
        console.log(filtered);
        this.auctions = filtered;
      })
    }
  },
  created () {
    // await axios.get("/api/date")
    //   .then((res) => {
    //     console.dir(res);
    //     this.date = res.data.date;
    //   });
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
