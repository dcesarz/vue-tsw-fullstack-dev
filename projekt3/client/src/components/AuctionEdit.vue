<template>
  <div>
    <div
      id="edit"
      v-if="(oldAuction.seller === currentUser.username) && (oldAuction.status ===  `new`)"
    >
      <button class="white-button" @click="toggleVisibility()">Edit this auction</button>
      <div v-show="isVisible">
        <form class="form-card">
          <label class="label" for="name-input">Name:</label>
          <input
            v-model="formData.name"
            id="name-input"
            class="form-text"
            type="text"
            minlength="3"
            placeholder="Name"
            required
            maxlength="50"
          />
          <br />
          <br />
          <label class="label" for="price-input">Price:</label>
          <input
            v-model="formData.price"
            id="price-input"
            class="form-text"
            type="number"
            min="1"
            step="1"
            placeholder="Price"
            required
          />
          <br />
          <br />
          <label class="label" for="name-input">Description:</label>
          <input
            v-model="formData.description"
            id="desc-input"
            class="form-text"
            type="text"
            placeholder="Description"
            required
            maxlength="255"
          />
          <br />
          <br />
          <label class="label" for="name-input">Type:</label>
          <select v-model="formData.type" id="select" name="select">
            <option value="bid">Bid</option>
            <option value="buy">Buy</option>
          </select>
          <br />
          <br />
          <div v-if="formData.type === 'bid'">
            <label class="label" for="name-input">Ends on..:</label>
            <input type="date" v-model="formData.date" placeholder="date" />
          </div>
          <br />
          <br />
          <input type="button" class="white-button" @click="updateAuction()" value="Submit" />
          <br />
          <br />
          <br />
          <br />
        </form>
      </div>
      <input
        class="white-button"
        type="button"
        value="Start the auction"
        v-if="oldAuction.status === 'new'"
        @click="startAuction()"
      />
    </div>
  </div>
</template>

<script>
import axios from "../axios";
import { mapGetters } from "vuex";
export default {
  name: "AuctionEdit",
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  props: ["oldAuction", "emitter"],
  data() {
    return {
      isVisible: false,
      formData: {
        _id: this.oldAuction._id,
        seller: this.oldAuction.seller,
        name: this.oldAuction.name,
        price: this.oldAuction.price,
        date: this.oldAuction.date,
        description: this.oldAuction.description,
        status: this.oldAuction.status,
        type: this.oldAuction.type,
        bidders: this.oldAuction.bidders,
        latestBidder: this.oldAuction.latestBidder
      }
    };
  },
  methods: {
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
    updateAuction() {
      axios
        .put(`${location.origin}/api/auctions`, this.formData, {
          withCredentials: true
        })
        .then(() => {
          console.log("edited!");
          //this.$router.push("my-auctions/page/1");
        })
        .catch(error => {
          console.log(error);
        });
    },
    startAuction() {
      axios
        .patch(
          `${location.origin}/api/auctions/startauction`,
          { _id: this.formData._id },
          { withCredentials: true }
        )
        .then(() => {
          this.$router.push("/page/1");
        })
        .catch(error => {
          this.logError(error);
        });
    }
  },
};
</script>


<style>
@import '../assets/style.css';
</style>