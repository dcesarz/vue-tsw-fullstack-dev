<template>
  <div v-if="auction !== null" class="auction">
    <div v-if="auction.type === 'Bid'">
      <h3>Auction</h3>
    </div>
    <div v-if="auction.type === 'Buy'">
      <h3>Product</h3>
    </div>
    <div v-if="!isEditMode">
      <AuctionDetails
       :auction="auction" :currUser="currUser"
       :timeLeft="timeLeft" :socket="socket"/>
    </div>
    <div v-if="isAuthAndIsOwnerAndIsNotStarted">
      <button id="btn-edit" class="button" @click="showEdit()">
        {{ editButtonText }}
      </button>
    </div>
    <div v-if="isEditMode">
      <AuctionEditForm :auction="auction" :currUser="currUser"/>
    </div>
  </div>
</template>


<script>
import AuctionDetails from "@/components/AuctionDetails";
import AuctionEditForm from "@/components/AuctionEditForm";
import { mapGetters } from "vuex";
import io from "../../../node_modules/socket.io-client";

export default {
    name: "Auction",
    components: {
        AuctionDetails,
        AuctionEditForm
    },
    props: ["auction", "currUser"],
    data () {
        return {
            socket: io(),
            isEditMode: false,
            editButtonText: "Edit",
            timeLeft: null
        };
    },
    computed: {
        ...mapGetters(["currentUser"]),
        isAuthAndIsOwnerAndIsNotStarted: function () {
            return this.currUser.isAuth &&
            this.auction.seller === this.currUser.username &&
            this.auction.status === "New";
        }
    },
    methods: { // TODO CMON
        showEdit: function () {
            this.isEditMode = !this.isEditMode;
            if (this.isEditMode) {
                this.editButtonText = "Cancel changes";
            } else {
                this.editButtonText = "Edit";
            }
        }
    },
    created () {
        if (this.auction.status === "OnSale" &&
            this.auction.type === "Bid" &&
            this.auction.duration !== null &&
            new Date(this.auction.duration).getTime() >= new Date().getTime()) {
            console.log("Countdown started!");
            this.timer = setInterval(() => {
                const now = new Date().getTime();
                const to = new Date(this.auction.duration);

                const tempTime = to - now;

                const hours = Math.floor((tempTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((tempTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((tempTime % (1000 * 60)) / (1000));

                let hoursString = hours.toString();
                let minutesString = minutes.toString();
                let secondsString = seconds.toString();

                if (hoursString.length === 1) {
                    hoursString = `0${hoursString}`;
                }
                if (minutesString.length === 1) {
                    minutesString = `0${minutesString}`;
                }
                if (secondsString.length === 1) {
                    secondsString = `0${secondsString}`;
                }
                this.timeLeft = `${hoursString}:${minutesString}:${secondsString}`;

                if (tempTime <= 0) {
                    clearInterval(this.timer);
                    location.reload();
                }
            });
        }
        if (this.currUser.isAuth &&
            this.auction.type === "Bid" &&
            this.auction.status === "OnSale") {
            console.log("Joined an auction!");
            this.socket.emit("join-auction", {
                id: this.auction._id,
                username: this.currentUser.username
            });
        }

        this.socket.on("new-bid", (data) => {
            console.log(`New bid from ${data.latestBidder} has arrived!`);
            this.auction.price = data.price;
            this.auction.latestBidder = data.latestBidder;
        });

        window.onbeforeunload = () => {
            if (this.currUser.isAuth &&
                this.auction.type === "Bid") {
                console.log("Left auction!");
                this.socket.emit("leave-auction", {
                    id: this.auction._id,
                    username: this.currentUser.username
                });
            }
        };
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
