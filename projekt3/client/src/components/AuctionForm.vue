<template>
  <div>
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
      <label for="desc-input">Description:</label>
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
      <label for="type-input">Type:</label>
      <select v-model="formData.type" id="type-input" name="select">
        <option value="bid">Bid</option>
        <option value="buy">Buy</option>
      </select>
      <br />
      <br />
      <div v-if="formData.type === 'bid'">
        <label for="date-input">Ends on..:</label>
        <input id="date-input" type="date" v-model="formData.date" placeholder="date" />
      </div>
      <br />
      <br />
      <input type="button" @click="newAuction()" value="Submit">
      <br />
      <br />
    </form>
  </div>
</template>

<script>
import axios from "../axios";
//import store from "../store";
export default {
  name: "AuctionForm",
  data() {
    return {
      formData: {
        name: "",
        description: "",
        price: "",
        seller: this.$store.getters.currentUser.username,
        type: "",
        date: "",
        status: "new",
      }
    };
  },
  methods: {
    async newAuction() {
      await axios
        .post(
          //'https://localhost:3000/api/auctions',
          //`${location.origin}/api/auctions`
          `${location.origin}/api/auctions/auction`,
          this.formData,
          { withCredentials: true }
        )
        .then(() => {
          this.$router.push("/");
        })
        .catch(err => {
          alert(err);
        });
    }
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
