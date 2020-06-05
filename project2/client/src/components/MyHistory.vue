<template>
  <div class="my-history">
    <h1>My history</h1>
    <AuctionList :apiurl="apiurl"/>
  </div>
</template>

<script>
import AuctionList from "@/components/AuctionList";

export default {
    name: "MyHistory",
    components: {
        AuctionList
    },
    data () {
        return {
            apiurl: "/api/biditems/my-history/page/"
        };
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
