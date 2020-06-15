<template>
  <div>
    <form class="form-card">
      <label class="label" for="name-input">Name:</label>
      <br />
      <label
        class="warning-label"
        for="name-input"
        v-if="$v.formData.name.$invalid && $v.formData.name.$dirty"
      >Name cannot be empty or less than 3 characters long!</label>
      <input
        v-model="formData.name"
        id="name-input"
        class="form-text"
        type="text"
        minlength="3"
        placeholder="Name"
        required
        maxlength="50"
        @input="$v.$touch()"
      />
      <br />
      <br />
      <label class="label" for="price-input">Price:</label>
      <br />
      <label
        v-if="$v.formData.price.$invalid && $v.formData.price.$dirty"
        class="warning-label"
        for="price-input"
      >Price is required!</label>
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
        @input="$v.$touch()"
      />
      <br />
      <br />
      <label class="label" for="desc-input">Description:</label>
      <br />
      <label
        class="warning-label"
        for="desc-input"
        v-if="$v.formData.description.$invalid && $v.formData.description.$dirty"
      >Description cannot be empty or have less than 3 characters!</label>
      <input
        v-model="formData.description"
        id="desc-input"
        class="form-text"
        type="text"
        placeholder="Description"
        required
        maxlength="255"
        @input="$v.$touch()"
      />
      <br />
      <br />
      <label class="label" for="type-input">Type:</label>
      <br />
      <label
        v-if="$v.formData.type.$invalid && $v.formData.type.$dirty"
        class="warning-label"
        for="type-input"
      >The type is required!</label>
      <br />
      <select v-model="formData.type" id="type-input" name="select">
        <option value="bid">Bid</option>
        <option value="buy">Buy</option>
      </select>
      <br />
      <br />
      <div v-if="formData.type === 'bid'">
        <label class="label" for="date-input">Ends on.. (DD.MM.YYYY):</label>
        <br>
        <label
          v-if="$v.formData.date.$invalid && $v.formData.date.$dirty"
          class="warning-label"
          for="date-input"
        >Date cannot be empty or earlier than tommorrow!</label>
        <br />
        <input
          @input="$v.$touch()"
          id="date-input"
          type="date"
          v-model="formData.date"
          placeholder="date"
        />
      </div>
      <br />
      <br />
      <input
        class="white-button"
        v-if="(formData.type === 'bid' &&
            !$v.formData.name.$invalid &&
            !$v.formData.date.$invalid &&
            !$v.formData.price.$invalid &&
            !$v.formData.type.$invalid &&
            !$v.formData.description.$invalid )||
          (formData.type === 'buy' &&  
            !$v.formData.name.$invalid && 
            !$v.formData.price.$invalid && 
            !$v.formData.type.$invalid && 
            !$v.formData.description.$invalid ) "
        type="button"
        @click="newAuction()"
        value="Submit"
      />
      <br />
      <br />
    </form>
  </div>
</template>

<script>
const { required, minLength } = require("vuelidate/lib/validators");
//import moment from "moment";
import axios from "../axios";

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
        status: "new"
      }
    };
  },
  validations: {
    formData: {
      name: {
        required,
        minLength: minLength(3)
      },
      description: {
        required,
        minLength: minLength(3)
      },
      price: {
        required
      },
      type: {
        required
      },
      date: {
        minValue: value => value > new Date().toISOString()
      }
    }
  },
  methods: {
    async newAuction() {
      await axios
        .post(`${location.origin}/api/auctions/auction`, this.formData, {
          withCredentials: true
        })
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
@import "../assets/style.css";
</style>