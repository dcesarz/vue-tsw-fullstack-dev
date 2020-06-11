<template>
  <div id="details">
    <tr>
      <th>Name:</th>
      <td>{{auction.name}}</td>
    </tr>
    <tr>
      <th>Seller:</th>
      <td>{{auction.seller}}</td>
    </tr>
    <tr>
      <th>Description:</th>
      <td>{{auction.description}}</td>
    </tr>
    <tr>
      <th>Price:</th>
      <td>{{auction.price}}</td>
    </tr>
    <tr>
      <th>Date:</th>
      <td>{{formatted_date}}</td>
    </tr>
  </div>
</template>

<script>
import { mapGetters} from "vuex";
var moment = require('moment');

export default {
  name: "AuctionDetails",
    computed: {
    ...mapGetters(["currentUser", "isAuthenticated"]),
    isValidBidder: function () {
      return this.currentUser.username !== this.auction.username && this.isAuthenticated;
    }
  },
  props: ["auction", "emitter"],
  data () {
    return {
      formated_date: "",
      id: this.auction._id,
      price: ""
    };
  },
  created() {
      console.log(this.auction);
      this.formatted_date = moment(this.auction.date).format('YYYY-MM-DD');
  }
  //methods: {
    //...mapActions(["logError"]),
    // buy () {
    //   this.emitter.emit("new_buy", {
    //     _id: this.auction._id,
    //     highest_bidder: this.user.username,
    //     status: "SOLD"
    //   });
    // },
    // bid () {
    //   if (this.price <= this.auction.price) {
    //     console.log("Pay more plz");
    //   } else {
    //    this.emitter.emit("new_bid", {
    //       _id: this.auction._id,
    //       highest_bidder: this.user.username,
    //       price: this.price
    //     });
    //   }
    // }
  //}
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
#details{
  padding: 50px;
}
</style>
