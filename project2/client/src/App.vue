<template>
  <div id="app">
    <Navigation />
    <Home />
    <router-view/>
  </div>
</template>

<script>
import Navigation from './components/Navigation';

export default {
  name: 'App',
  components: {
    Navigation,
  },
};
</script>

<style lang="scss">
@import '@/assets/index.scss';
</style>
