<template>
  <div id="details">
    <h2>{{auction.name}}</h2>
    <br />
    <br />Seller:
    <br />
    {{auction.seller}}
    <br />
    <br />Description:
    <br />
    {{auction.description}}
    <br />
    <br />Price:
    <br />
    {{auction.price}}
    <br />
    <div v-if="auction.type === 'bid'">
      <br />Ends on..:
      <br />
      {{formatted_date}}
      <br />
    </div>
    <br />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
var moment = require("moment");

export default {
  name: "AuctionDetails",
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"]),
    isValidBidder: function() {
      return (
        this.currentUser.username !== this.auction.seller &&
        this.isAuthenticated
      );
    }
  },
  props: ["auction", "emitter"],
  data() {
    return {
      formated_date: "",
      id: this.auction._id,
      price: ""
    };
  },
  created() {
    console.log(this.auction);
    this.formatted_date = moment(this.auction.date).format("YYYY-MM-DD");
  }
};
</script>


<style>
@import "../assets/style.css";
</style>