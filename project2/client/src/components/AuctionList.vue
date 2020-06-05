<template>
    <div>
        <div v-if="auctions !== null">
            <ul>
                <li v-for="auction in auctions" :key="auction._id">
                    <Auction :auction="auction" :currUser="currUser" />
                </li>
            </ul>
            <div>
            <button @click="prevPage()" id="btnPrev">
            &lt;
            </button>
            <button @click="nextPage()" id="btnNext">
            &gt;
            </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
//theres gotta be a better way to define this
import Auction from "../components/Auction";
export default {
    name: "AuctionList",
    components: { Auction },
    props: ["apiurl"],
    data (){
        return{
            currentUser: this.$store.getters.currentUser,
            auctions: null,
            currentPage: 0,
            isNextPage: false,
            isPrevPage: false
        }
    },
    methods: {
        nextPage(){
            this.currentPage += 1;
            this.goToPage(this.currentPage);
        },
        prevPage(){
            this.currentPage -= 1;
            this.goToPage(this.currentPage);
        },
        goToPage(){
            axios .get(this.apiurl + this.currentPage)
            .then((resp) =>
            {
                this.isNextPage = resp.data.nextPage;
                this.isPrevPage = resp.data.prevPage;
                this.auctions = resp.data.auctions;

                const newurl = `${location.origin}/page/` + this.currentPage;

                if(history.pushState){
                    window.history.pushState({path: newurl}, "", newurl);
                }
            }
            )
        }
},
created () {
    this.currentPage = parseInt(this.$route.params.page);
    axios .get(this.apiurl + this.currentPage)
    .then((resp)=> {
            this.isNextPage = resp.data.nextPage;
            this.isPrevPage = resp.data.prevPage;
            this.auctions = resp.data.auctions;
    })
    .catch((err) => {
        console.log(err);
    })
},
    updateButtonStyle () {
            if (this.isPrevPage) {
                document.getElementById("btnPrev").style.visibility = "visible";
            } else {
                document.getElementById("btnPrev").style.visibility = "hidden";
            }
            if (this.isnNextPage) {
                document.getElementById("btnNext").style.visibility = "visible";
            } else {
                document.getElementById("btnNext").style.visibility = "hidden";
            }
        },
    updated() {
        this.updateButtonStyle();
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
