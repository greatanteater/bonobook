<template>
  <div id="wrapper">
    <GreatFlip />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import GreatFlip from '@/components/GreatFlip.vue';

onMounted(() => {
  resizeHandler();
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
});

const resizeHandler = () => {
  const wrapper = document.getElementById('wrapper');
  if (wrapper) {
    wrapper.style.width = `${window.innerWidth}px`;
    wrapper.style.height = `${window.innerHeight}px`;
  }
};
</script>

<style>
* {
  user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#wrapper {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}
</style>
