<!-- WILL SHOW SINGLE AUCTION. -->
<template>
  <div class="auction-card">
    <AuctionDetails :auction="auction" />
    <AuctionEdit v-if="isAuthenticated" v-on:edited="emittedEdit" :oldAuction="auction" :emitter="emitter" />
    <AuctionBid :auction="auction" :emitter="emitter" />
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
  props: ["auction","id"],
  components: {
    AuctionDetails,
    AuctionEdit,
    AuctionBid
  },
  data() {
    return {
      emitter: io({ transports: ["websocket"] }),
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  methods: {
    emittedEdit(value){
      console.log(value);
      this.auction.price = value.price;
      this.auction.description = value.description;
      this.auction.name = value.name;
      this.auction.date = value.date;
      this.auction.type = value.type;
    }
  },
  created() {
        if (
          this.isAuthenticated &&
          this.auction.status === "onSale"
        ) {
          this.emitter.emit("joinAuction", {
            _id: this.auction._id,
            username: this.currentUser.username
          });
        }
        this.emitter.on("buy", cb => {
          this.auction.status = cb.status;
          this.auction.latestBidder = cb.latestBidder;
        });

        this.emitter.on("bid", cb => {
          this.auction.price = cb.price;
          this.auction.latestBidder = cb.latestBidder;
        });
      
  },
  beforeDestroy() {
    if (
      this.isAuthenticated &&
      this.auction.status === "onSale"
    ) {
      this.emitter.emit("leave", {
        id: this.auction._id,
        username: this.currentUser.username
      });
    }
  }
};
</script>

<style>
@import '../assets/style.css';
</style>