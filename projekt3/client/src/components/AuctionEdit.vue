<template>
  <div>
    <div id="edit" v-if="oldAuction.seller === currentUser.username">
      <button @click="toggleVisibility()">Edit this auction</button>
      <div v-show="isVisible">
        <form>
          <label for="name-input">Name:</label>
          <input
            v-model="formData.name"
            id="name-input"
            class="input"
            type="text"
            minlength="3"
            placeholder="Name"
            required
            maxlength="50"
          />
          <br />
          <br />
          <label for="price-input">Price:</label>
          <input
            v-model="formData.price"
            id="price-input"
            class="input"
            type="number"
            min="1"
            step="1"
            placeholder="Price"
            required
          />
          <br />
          <br />
          <label for="name-input">Description:</label>
          <input
            v-model="formData.description"
            id="desc-input"
            class="input"
            type="text"
            placeholder="Description"
            required
            maxlength="255"
          />
          <br />
          <br />
          <label for="name-input">Type:</label>
          <select v-model="formData.type" id="select" name="select">
            <option value="bid">Bid</option>
            <option value="buy">Buy</option>
          </select>
          <br />
          <br />
          <div v-if="formData.type === 'bid'">
            <label for="name-input">Ends on..:</label>
            <input type="date" v-model="formData.date" placeholder="date" />
          </div>
          <br />
          <br />
          <input type="button" @click="updateAuction()" value="Submit" />
          <br />
          <br />
          <input type="button" value="Start the auction" v-if="oldAuction.status === 'new'" @click="startAuction()" />
          <br />
          <br />
        </form>
      </div>
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
        username: this.oldAuction.username,
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
          console.log("edited!")
        })
        .catch(error => {
          console.log(error);
        });
    },
    startAuction () {
      axios
        .patch(
          `${location.origin}/api/auctions/startauction`,
          { _id: this.formData._id }, { withCredentials: true })
        .then(() => {
          location.reload();
        })
        .catch((error) => {
          this.logError(error);
        });
    },
  },
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
tr {
  padding: 10px;
}
</style>
