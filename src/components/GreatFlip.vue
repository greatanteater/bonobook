<template>
  <div class="great-flip">
    <Flipbook class="flipbook" :pages="greatFlip.getPages()" :gloss=0 ref="flipbook"></Flipbook>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Flipbook from 'flipbook-vue';
import Setting from '../activity/base/Setting';
import GreatFlip from '../activity/scene/GreatFlip';

export default defineComponent({
  components: {
    Flipbook,
  },
  setup() {
    const greatFlip = new GreatFlip(); // GreatFlip 클래스 인스턴스 생성
    return {
      greatFlip,
      sceneWidth: Setting.sceneWidth,
      sceneHeight: Setting.sceneHeight,
    };
  },
});
</script>

<style>
.flipbook {
  width: 100%;
  height: 100%;
}

.flipbook .bounding-box {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.great-flip {
  width: 100%;
  height: 100%;
}
</style>
