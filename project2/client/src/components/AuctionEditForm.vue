<template>
    <div>
        <form>
            <div>
                <label for="name-input">Auction name: </label>
                <br>
                <input placeholder="Auction name" required="" v-model="formData.name" id="name-input" minlength="5" type="text"> 
                <br>
                <label for="type-input">Select type: </label>
                <br>
                <select v-model="formData.type" id="type-input">
                    <option value="Bid">Bid</option>
                    <option value="Buy">Buy</option>
                </select>
                <br>
                <label for="name-input">Price: </label>
                <br>
                <input placeholder="Price" required="" v-model="formData.price" id="price-input" min="0.01" step="0.01" type="text"> 
                <br>
                <label for="duration-input">Auction duration:</label>
                <br>
                <select v-model="formData.duration" id="type-input">
                    <option v-for="option in options" :key="option.text" v-bind:value="option.value">
                    {{option.text}}
                    </option>
                </select>
                <button type="submit">Save</button>
            </div>
        </form>
                <button @click="auctionDelete()">Delete</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
name: "AuctionEditForm",
props: ["auction", "currentUser"],
data()
{
    return{
        options: [
            { text: "30 seconds", value: 1000 * 30 },
            { text: "1 hour", value: 1000 * 60 * 60},
            { text: "3 hours", value: 1000 * 60 * 60 * 3},
            { text: "6 hours", value: 1000 * 60 * 60 * 6 },
            { text: "12 hours", value: 1000 * 60 * 60 * 12 },
        ],
        formData: {
            id: this.auction._id,
            type: this.auction.type,
            name: this.auction.name,
            price: this.auction.price,
            duration: this.getDuration(),
            seller: this.currentUser.username
        }
    }
},
    methods: {
        getDuration (){
            if (this.auction.type === "Buy"){
                return 1000 * 60 * 60 * 24;
            } else {
                return this.auction.duration;
            }
        },
        updateBidItem(){
            if(this.formData.type === "Buy"){
                this.formData.duration = null;
            }
            axios .patch(`${location.origin}/api/biditems/biditem`, this.formData)
            .then(() =>
            {
                location.reload();
            })
            .catch((err) => {
                console.log(err);
            })
        },
        deleteBidItem() {
            const body = {
                id: this.auction._id
            }
            axios .delete(`${location.origin}/api/biditems/biditem/` + body.id, body)
                .then(()=> {
                    this.$router.push('/page/page/1')
                })
            }
        }
    }



</script>