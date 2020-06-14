<template>
  <div>
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
      <label class="label" for="desc-input">Description:</label>
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
      <label class="label" for="type-input">Type:</label>
      <select v-model="formData.type" id="type-input" name="select">
        <option value="bid">Bid</option>
        <option value="buy">Buy</option>
      </select>
      <br />
      <br />
      <div v-if="formData.type === 'bid'">
        <label class="label" for="date-input">Ends on..:</label>
        <input id="date-input" type="date" v-model="formData.date" placeholder="date" />
      </div>
      <br />
      <br />
      <input class="white-button" type="button" @click="newAuction()" value="Submit">
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
          `${location.origin}/api/auctions/auction`,
          this.formData,
          { withCredentials: true }
        )
        .then(() => {
          this.$router.push("my-auctions/page/1");
        })
        .catch(err => {
          alert(err);
        });
    }
  }
};
</script>


<style>
@import '../assets/style.css';
</style>