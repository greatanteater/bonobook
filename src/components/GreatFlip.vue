<template>
  <div class="great-flip">
    <Flipbook v-if="isGreatFlipLoaded" class="flipbook" :pages="greatFlip.getPages()" :gloss="0"></Flipbook>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import Flipbook from 'flipbook-vue';
import GreatFlip from '../activity/scene/GreatFlip';

export default defineComponent({
  components: {
    Flipbook,
  },
  setup() {
    const greatFlip = new GreatFlip(); // GreatFlip 클래스 인스턴스 생성
    const isGreatFlipLoaded = ref(false); // GreatFlip 클래스 로드 여부를 나타내는 변수

    // 컴포넌트가 마운트된 후에 GreatFlip 초기화 함수 실행
    onMounted(() => {
      // GreatFlip 클래스 초기화 작업이 완료된 후에 isGreatFlipLoaded 값을 true로 변경
      greatFlip.init().then(() => {
        isGreatFlipLoaded.value = true;
      });
    });

    return {
      greatFlip,
      isGreatFlipLoaded,
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
