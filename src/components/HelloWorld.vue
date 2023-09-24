<template>
  <Flipbook class="flipbook" :pages="pages" />
</template>

<script lang="ts">
import { ref } from 'vue';
import Flipbook from 'flipbook-vue';

export default {
  components: {
    Flipbook,
  },
  setup() {
    const pages = ref<string[]>([
      '',
      'images/1.jpg',
      'images/2.jpg',
      'images/3.jpg',
      'images/6.jpg',
    ]);
    return {
      pages,
    };
  },
};
</script>

<style scoped>
html,
body {
  overflow: hidden;
  margin: 0;
  background-color: aqua;
}
.flipbook {
  overflow: hidden;
  width: 1300px;
  height: 780px;
}
</style>
