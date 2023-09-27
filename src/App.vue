<template>
  <div id="app">
    <GreatFlip />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GreatFlip from './components/GreatFlip.vue';

export default defineComponent({
  components: {
    GreatFlip,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 1300px;
  height: 812px;
}
body {
  position: absolute;
  margin: 0;
  overflow: hidden;
}

</style>
