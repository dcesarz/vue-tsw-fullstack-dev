<template>
  <div>
    <h1>My auctions</h1>
    <div v-if="currentUser.isAuth">
      <button @click="newAuction()">New auction</button>
    </div>
    <AuctionList :apiurl="apiurl"/>
  </div>
</template>

<script>
import AuctionList from "../components/AuctionList";
import { mapGetters } from "vuex";

export default {
    name: "MyAuctions",
    components: {
        AuctionList
    },
    data () {
        return {
            apiurl: "/api/biditems/my-auctions/page/"
        };
    },
    computed: {
        ...mapGetters(["currentUser"])
    },
    methods: {
        goToAuctionForm () {
            this.$router.push("/auction");
        }
    }
};
</script>
