<!-- WILL SHOW SINGLE AUCTION. -->
<template>
    <div>
        <AuctionDetails :auction="auction"/>
        <AuctionEdit :oldAuction="auction"/>
    </div>
</template>

<script>
import AuctionDetails from "./AuctionDetails";
import AuctionEdit from "./AuctionEdit";
export default {
    name: "Auction",
    props: ["auction"],
    components: {
        AuctionDetails,
        AuctionEdit
    }
}
</script>

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
