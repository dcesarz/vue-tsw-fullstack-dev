<template>
  <div>
      <div v-if="oldAuction.seller === currentUser.username">
        <button>Edit this auction</button>
      </div>
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
      <input type="button" @click="updateAuction()" value="Submit">
      <br />
      <br />
    </form>
  </div>
</template>

<script>
import axios from "../axios";
import { mapGetters} from "vuex";
export default {
    name: "AuctionEdit",
    computed: {
    ...mapGetters(["currentUser", "isAuthenticated"]),
    isValidBidder: function () {
      return this.currentUser.username !== this.auction.username && this.isAuthenticated;
    }
  },
  props: ["oldAuction", "emitter"],
  data () {
    return {
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
        highest_bidder: this.oldAuction.latestBidder
        }
    };
  },
    methods: {
    updateAuction () {
      // const auction = {
      //   _id: this.auction.id,
      //   name: this.auction.name,
      //   price: this.auction.price,
      //   type: this.auction.type,
      //   username: this.auction.username,
      //   status: this.auction.status,
      //   description: this.auction.description,
      //   date: this.auction.date,
      //   bidders: this.auction.bidders,
      //   highest_bidder: this.auction.highest_bidder
      // };
      //const newUrl = 'https://localhost:3000/api/auctions/auction/' + this.oldAuction._id;
      axios
        .put('https://localhost:3000/api/auctions/', this.formData, { withCredentials: true })
        .then(() => {
          location.reload();
        })
        .catch((error) => {
          console.log(error);
          //this.logError(error);
        });
    }
  },
  created() {
      console.log("edit rendered");
  }
};
</script>

<style scoped>
h1, h2 {
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
