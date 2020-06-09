<template>
  <div class="auction-form">
    <h2>Create auction</h2>
    <form @submit.prevent="createAuction()">
      <label for="name-input">Name: </label>
      <input v-model="formData.name" id="name-input" class="input" type="text"
       minLength="3" placeholder="Name" required="">
      <br><br>
      <label for="price-input">Price: $ </label>
      <input v-model="formData.price" id="price-input" class="input" type="number"
       min="0.01" step="0.01" placeholder="Price"
       size="9" required="">
      <br><br>
      <div class="select-type">
        <label for="type-input">Type: </label>
        <select v-model="formData.type" id="type-input">
          <option value="Bid">Bid</option>
          <option value="Buy">Buy now</option>
        </select>
        <br><br>
      </div>
      <div v-if="formData.type === 'Bid'">
        <label for="duration-input">Duration: </label>
        <select v-model="formData.duration" id="type-input">
          <option v-for="option in options" :key="option.text"
          v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div><br>
      <label for="jack">Start auction</label>
      <input v-model="isStartAuction" type="checkbox">
      <br><br>
      <button type="submit">Create</button>
      <br><br>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import io from "@/../node_modules/socket.io-client";

export default {
    name: "AuctionNewForm",
    data () {
        return {
            socket: io(),
            options: [
                { text: "30 Seconds", value: 1000 * 30 },
                { text: "1 Hour", value: 1000 * 60 * 60},
                { text: "3 Hours", value: 1000 * 60 * 60 * 3},
                { text: "6 Hours", value: 1000 * 60 * 60 * 6 },
                { text: "12 Hours", value: 1000 * 60 * 60 * 12 },
                { text: "1 Day", value: 1000 * 60 * 60 * 24},
                { text: "3 Days", value: 1000 * 60 * 60 * 24 * 3},
                { text: "1 Week", value: 1000 * 60 * 60 * 24 * 7}
            ],
            isStartAuction: false,
            formData: {
                name: null,
                price: null,
                type: "Bid",
                status: "New",
                duration: this.calculateData(1)
            }
        };
    },
    methods: {
        createAuction () {
            axios
                .post("/api/biditems", this.formData)
                .then((res) => {
                    if (this.isStartAuction) {
                        console.dir(res.data._id);
                        this.startAuction(res.data._id);
                    } else {
                        location.reload();
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        startAuction (_id) {
            axios
                .patch("/api/biditems/new", { id: _id })
                .then(() => {
                    this.socket.emit("start-auction", {
                        id: _id,
                        username: this.$store.getters.currentUser.username
                    });
                    location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
