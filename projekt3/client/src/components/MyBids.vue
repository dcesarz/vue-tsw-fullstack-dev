<!-- WILL SHOW ALL AUCTIONS. -->
<template>
  <div>
    <h1>Hello {{currentUser.username}}! Here's list of your bids...</h1>
      <div class="auction-list" v-for="auction in auctions" :key="auction._id">
        <Auction :auction="auction" />
      </div>
      <button class="white-button" id="btnPrevPage" @click="Prev()">&lt;</button>
      <button class="white-button" id="btnNextPage" @click="Next()">&gt;</button>
  </div>
</template>

<script>
import axios from "../axios";
import Auction from "./Auction";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      currentPage: 0,
      nextPage: false,
      previousPage: false,
      totalPageCount: 0,
      auctions: {}
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  components: {
    Auction
  },
  methods: {
    isThereNextPage(){
      // having problems with plugins, so im resorting to this.
      const sumCurrent = 3 * this.currentPage;
      const sumAll = 3 * this.totalPageCount;
      if(sumCurrent < sumAll) return true;
      else return false;
    },
    isTherePrevPage(){
      // having problems with plugins, so im resorting to this.
      const sumCurrent = 3 * this.currentPage;
      if((sumCurrent - 3) > 0) return true;
      else return false;
    },
    Next() {
      this.currentPage++;
      this.changePage(this.currentPage);
    },
    Prev() {
      this.currentPage--;
      this.changePage(this.currentPage);
    },
    changePage(page) {
      axios
        .get(`${location.origin}/api/auctions/my-bids/page/${this.currentPage}`)
        .then(resp => {
        this.auctions = resp.data.docs;
        this.totalPageCount = resp.data.totalPages;
        this.nextPage = this.isThereNextPage();
        this.previousPage = this.isTherePrevPage();
          console.log(page);
          if (history.pushState) {
            var newURL =
              window.location.protocol +
              "//" +
              window.location.host +
              "/page/" +
              this.currentPage;
            window.history.pushState({ path: newURL }, "", newURL);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.currentPage = parseInt(this.$route.params.page);
    axios
      .get(`${location.origin}/api/auctions/my-bids/page/${this.currentPage}`)
      .then(resp => {
        this.auctions = resp.data.docs;
        this.totalPageCount = resp.data.totalPages;
        this.nextPage = this.isThereNextPage();
        this.previousPage = this.isTherePrevPage();
      })
      .catch(err => {
        console.log(err);
      });
  },
  updated() {
  if (this.nextPage) {
        document.getElementById("btnNextPage").style.visibility = "visible";
      } else {
        document.getElementById("btnNextPage").style.visibility = "hidden";
      }
      if (this.previousPage) {
        document.getElementById("btnPrevPage").style.visibility = "visible";
      } else {
        document.getElementById("btnPrevPage").style.visibility = "hidden";
      }
  }
};
</script>


<style>
@import '../assets/style.css';
</style>