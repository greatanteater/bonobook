<template>
  <div id="wrapper">
    <GreatFlip />
  </div>
</template>

<script lang="ts" setup>
import Setting from '@/activity/base/Setting'
import { onMounted, onUnmounted } from 'vue';
import GreatFlip from '@/components/GreatFlip.vue';

onMounted(() => {
  setTimeout(resizeHandler, 0);
  window.addEventListener('resize', resizeHandler);
  window.addEventListener('orientationchange', resizeHandler);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
  window.removeEventListener('orientationchange', resizeHandler);
});

const resizeHandler = () => {
  const app = document.getElementById('app');
  const wrapper = document.getElementById('wrapper');

  if (app) {
    const horzScale = app.offsetWidth / Setting.sceneWidth
    const vertScale = app.offsetHeight / Setting.sceneHeight
    if (wrapper) {
      if (horzScale > vertScale) {
        wrapper.style.transform = `translateX(${(window.innerWidth - Setting.sceneWidth * vertScale) / 2}px) scale(${vertScale})`
      } else {
        wrapper.style.transform = `translateY(${(window.innerHeight - Setting.sceneHeight * horzScale) / 2}px) scale(${horzScale})`
      }
    }
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

#app {
  left: 0px;
  top: 0px;
  width: 100vw;
  height: 100vh;
  position: absolute;
  overflow: hidden;
}

#wrapper {
  width: 1300px;
  height: 812px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  transform-origin: left top;
  position: absolute;
  color: #2c3e50;
  overflow: hidden;
}
</style>
