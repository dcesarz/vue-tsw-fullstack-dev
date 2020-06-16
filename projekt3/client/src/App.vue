<template>
  <div id="app">
    <div class="banner">
      <img alt="banner" src="./assets/banner2.jpg" />
    </div>
    <navigation />
    <router-view />
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";

export default {
  name: "App",
  components: {
    Navigation
  },
  async created() {
    await this.$store.dispatch("fetchCurrentUser");
    if (this.$store.getters.isAuthenticated) {
      this.$store.dispatch("commitConnectSocket");
      this.$store.getters.socket.emit("joinUser", {
        _id: this.$store.getters.currentUser.username
      });
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
