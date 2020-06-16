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
          />
          <br />
          <br />
          <label class="label" for="name-input">Description:</label>
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
          <label class="label" for="name-input">Type:</label>
          <br />
          <label
            v-if="$v.formData.type.$invalid && $v.formData.type.$dirty"
            class="warning-label"
            for="type-input"
          >The type is required!</label>
          <select v-model="formData.type" id="type-input" name="select">
            <option value="bid">Bid</option>
            <option value="buy">Buy</option>
          </select>
          <br />
          <br />
          <div v-if="formData.type === 'bid'">
            <label class="label" for="name-input">Ends on..:</label>
            <br />
            <label
              v-if="$v.formData.date.$invalid && $v.formData.date.$dirty"
              class="warning-label"
              for="date-input"
            >Date cannot be empty or earlier than tommorrow!</label>
            <input type="date" @input="$v.$touch()" v-model="formData.date" placeholder="date" />
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
        @click="startAuction()"
        value="Start the auction"
      />
    </div>
  </div>
</template>

<script>
const { required, minLength } = require("vuelidate/lib/validators");
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
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
    updateAuction() {
      axios
        .put(`${location.origin}/api/auctions`, this.formData, {
          withCredentials: true
        })
        .then(() => {
          this.oldAuction.date = this.formData.date;
          this.oldAuction.description = this.formData.description;
          this.oldAuction.name = this.formData.name;
          this.oldAuction.price = this.formData.price;
          this.toggleVisibility();
           this.$emit('edited', this.oldAuction)
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
  }
};
</script>


<style>
@import "../assets/style.css";
</style>