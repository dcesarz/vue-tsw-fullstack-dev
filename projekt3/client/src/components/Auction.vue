<!-- WILL SHOW SINGLE AUCTION. -->
<template>
  <div>
    <AuctionDetails :auction="auction" />
    <AuctionEdit :oldAuction="auction" :emitter="emitter"/>
    <AuctionBid :auction="auction" :emitter="emitter"/>
  </div>
</template>

<script>
import AuctionDetails from "./AuctionDetails";
import AuctionEdit from "./AuctionEdit";
import AuctionBid from "./AuctionBid";
import { mapGetters } from "vuex";
import io from "socket.io-client";

export default {
  name: "Auction",
  props: ["auction"],
  components: {
    AuctionDetails,
    AuctionEdit,
    AuctionBid
  },
  data() {
    return {
      emitter: io()
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  created() {
    if (
      this.isAuthenticated &&
      this.auction.type === "bid" &&
      this.auction.status === "onSale"
    ) {
      this.emitter.emit("join", {
        _id: this.auction._id,
        username: this.currentUser.username
      });
    }

    this.emitter.on("new-buy", cb => {
      console.log("new buy");
      this.auction.status = "sold";
      this.auction.latestBidder = cb.latestBidder;
    });

    this.emitter.on("new-bid", cb => {
      console.log("new bid");
      this.auction.price = cb.price;
      this.auction.latestBidder = cb.latestBidder;
    });
  },
  beforeDestroy () {
    if (this.isAuthenticated && this.auction.type === "bid" && this.auction.status === "onSale") {
      this.emitter.emit("leave", {
        id: this.auction._id,
        username: this.currentUser.username
      });
      console.log("left");
    }
}
}
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
