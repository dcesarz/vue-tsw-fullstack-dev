<template>
  <div>
      <div v-if="auction.type === 'bid'">
        <div v-if="auction.status === 'onSale'">
          <div v-if="isValidBidder">
            <tr><th><button class="white-button" @click="bidItem()">Bid</button></th>
            <td><input v-model="formData.price" type="number" min="1" step="1" placeholder="Your bid" size="9" ></td></tr>
          </div>
          <tr><th>Latest bidder:</th><td> {{ auction.latestBidder }}</td></tr>
        </div>
        <div v-else-if="auction.status === 'sold'">
          <tr><th>Bought for:</th><td> {{ auction.price }}</td></tr>
          <tr><th>Successful bidder:</th><td> {{ auction.latestBidder }}</td></tr>
        </div>
      </div>
      <div v-else-if="auction.type === 'buy'">
        <div v-if="auction.status === 'onSale'">
          <div v-if="isValidBidder">
            <tr><td><button class="white-button" @click="buyItem()">Buy</button></td></tr>
          </div>
        </div>
        <div v-else-if="auction.status === 'sold'">
          <tr><th>Bought for:</th><td> {{ auction.price }}</td></tr>
          <tr><th>Buyer:</th><td> {{ auction.latestBidder }}</td></tr>
        </div>
      </div>
    </div>

</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AuctionBid",
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"]),
    isValidBidder: function() {
      return (
        ((this.currentUser.username !== this.auction.seller) &&
        this.isAuthenticated)
      );
    },
    isOngoing: function() {
            if (new Date(this.auction.date).getTime() >= new Date().getTime()) {
                return true;
            }
            return false;
    }
  },
  props: ["auction", "emitter"],
  data() {
    return {
      formData: {
        _id: this.auction._id,
        price: 1,
        latestBidder: ""
      }
    };
  },
  methods: {
    toggleVisibility()
    {
        this.isVisible = !this.isVisible;
    },
    buyItem () {
      console.log("bought for:")
      console.log(this.auction.price);
      this.emitter.emit("new-buy", {
        _id: this.auction._id,
        latestBidder: this.currentUser.username,
        price: this.auction.price,
        status: "sold"
      });
      this.$router.push("/my-history/page/1");
    },
    bidItem () {
      if (this.formData.price <= this.auction.price) {
        console.log("Not enough : (!");
      } else {
        this.emitter.emit("new-bid", {
          _id: this.auction._id,
          latestBidder: this.currentUser.username,
          price: this.formData.price
        });
      }
      this.$forceUpdate();
    },
  created () {
    if (this.isAuthenticated && this.auction.type === "bid" && this.auction.status === "onSale") {
      this.emitter.emit("join", {
        _id: this.auction._id,
        username: this.currentUser.username
      });
    }
},
},
}
</script>


<style>
@import '../assets/style.css';
</style>