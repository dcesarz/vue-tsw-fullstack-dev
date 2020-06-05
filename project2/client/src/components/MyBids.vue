<template>
  <div class="my-bids">
    <h1>My bids</h1>
    <AuctionList :apiurl="apiurl"/>
  </div>
</template>

<script>
import AuctionList from "../components/AuctionList";

export default {
    name: "MyBids",
    components: {
        AuctionList
    },
    data () {
        return {
            apiurl: "/api/biditems/my-bids/page/"
        };
    }
};
</script>
