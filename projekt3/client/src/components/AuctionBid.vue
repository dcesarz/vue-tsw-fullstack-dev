<template>
  <div>
    <div v-if="auction.type === 'bid'">
      <div v-if="auction.status === 'onSale'">
        <div v-if="isValidBidder">
          <button
            v-if="auction.type === 'bid' && (formData.price > auction.price)"
            class="white-button"
            @click="bidItem()"
          >Bid</button>
          <br />
          <label for="date-input">Input your bid..</label>
          <br />
          <label
            v-if="formData.price <= auction.price"
            class="warning-label"
            for="date-input"
          >Price must be higher than current one and not empty!</label>
          <input
            v-model="formData.price"
            id="price-input"
            class="form-text"
            type="number"
            min="1"
            step="1"
            max="999999999"
            maxlength="9"
            oninput="this.value = this.value.slice(0, this.maxLength)"
            size="9"
            placeholder="Price"
            required
          />
          <br />
        </div>
        <div v-if="(auction.latestBidder !== null) && (auction.latestBidder !== '')">
          Latest bidder:
          {{ auction.latestBidder }}
        </div>
        <div v-if="auction.status === 'sold'">
          Bought for:
          {{ auction.price }}
          <br />
          Successful bidder:
          {{ auction.latestBidder }}
          <br />
        </div>
      </div>
    </div>
    <div v-if="auction.type === 'buy'">
      <div v-if="auction.status === 'onSale'">
        <div v-if="isValidBidder">
          <button class="white-button" @click="buyItem()">Buy</button>
        </div>
      </div>
      <div v-if="auction.status === 'sold'">
        <tr>
          <th>Bought for:</th>
          <td>{{ auction.price }}</td>
        </tr>
        <tr>
          <th>Buyer:</th>
          <td>{{ auction.latestBidder }}</td>
        </tr>
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
        this.currentUser.username !== this.auction.seller &&
        this.isAuthenticated
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
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
    buyItem() {
      console.log("bought for:");
      console.log(this.auction.price);
      this.emitter.emit("new-buy", {
        _id: this.auction._id,
        latestBidder: this.currentUser.username,
        price: this.auction.price,
        status: "sold"
      });
    },
    bidItem() {
      if (this.formData.price <= this.auction.price) {
        console.log("Not enough : (!");
      } else {
        this.emitter.emit("new-bid", {
          _id: this.auction._id,
          latestBidder: this.currentUser.username,
          price: this.formData.price
        });
      }
    },
    created() {
      if (
        this.isAuthenticated &&
        this.auction.status === "onSale"
      ) {
        this.emitter.emit("join", {
          _id: this.auction._id,
          username: this.currentUser.username
        });
      }
    }
  }
};
</script>


<style>
@import "../assets/style.css";
</style>