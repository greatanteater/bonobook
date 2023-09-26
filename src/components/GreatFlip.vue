<template>
  <div class="great-flip">
    <Flipbook v-if="isGreatFlipLoaded" class="flipbook" :pages="greatFlip.getPages()" :gloss="0" @update:page="greatNumber">
    </Flipbook>
    <button id="quit">
      <img :src="greatFlip.commonPath + '/quit.png'" alt="quitButton" @click="handleQuitButtonClick">
    </button>
    <button id="left">
      <img :src="greatFlip.commonPath + '/left.png'" alt="leftButton" @click="handleLeftButtonClick">
    </button>
    <button id="right">
      <img :src="greatFlip.commonPath + '/right.png'" alt="rightButton" @click="handleRightButtonClick">
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import Flipbook from 'flipbook-vue';
import GreatFlip from '../activity/scene/GreatFlip';

export default defineComponent({
  props: {
    msg: String, // msg 속성을 정의
  },
  components: {
    Flipbook,
  },
  setup() {
    const greatFlip = new GreatFlip(); // GreatFlip 클래스 인스턴스 생성
    const isGreatFlipLoaded = ref(false); // GreatFlip 클래스 로드 여부를 나타내는 변수

    let greatNumber = 0;

    // 컴포넌트가 마운트된 후에 GreatFlip 초기화 함수 실행
    onMounted(() => {
      // GreatFlip 클래스 초기화 작업이 완료된 후에 isGreatFlipLoaded 값을 true로 변경
      greatFlip.init().then(() => {
        isGreatFlipLoaded.value = true;
      });
    });

    const handleQuitButtonClick = () => {
      console.log('quit 버튼이 클릭되었습니다.:' + greatNumber);
    };

    const handleLeftButtonClick = () => {
      // 이 곳에 left 버튼을 클릭했을 때 실행할 코드를 작성
      console.log('left 버튼이 클릭되었습니다.');
    };

    const handleRightButtonClick = () => {
      // 이 곳에 left 버튼을 클릭했을 때 실행할 코드를 작성
      console.log('right 버튼이 클릭되었습니다.');
    };

    return {
      greatFlip,
      isGreatFlipLoaded,
      handleQuitButtonClick,
      handleLeftButtonClick,
      handleRightButtonClick,
      greatNumber
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
  position: absolute;
  width: 100%;
  height: 100%;
}

#quit {
  margin: 10px;
  padding: 0;
  z-index: 10;
  width: 72px;
  height: 76px;
  position: absolute;
  border: none;
  background-color: transparent;
  opacity: 0.5;
  top: 0;
  bottom: 0;
  right: 0;
  cursor: pointer;
}

#left {
  margin: 10px;
  padding: 0;
  z-index: 10;
  width: 72px;
  height: 71px;
  position: absolute;
  border: none;
  background-color: transparent;
  opacity: 0.5;
  left: 0;
  top: 352px;
  bottom: 0;
  cursor: pointer;
}

#right {
  margin: 10px;
  padding: 0;
  z-index: 10;
  width: 72px;
  height: 71px;
  position: absolute;
  border: none;
  background-color: transparent;
  opacity: 0.5;
  top: 352px;
  bottom: 0;
  right: 0;
  cursor: pointer;
}
</style>
