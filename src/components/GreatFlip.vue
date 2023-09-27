<template>
  <div class="great-flip">
    <Flipbook v-if="isGreatFlipLoaded" class="flipbook" :pages="greatFlip.getPages()" :gloss="0"
      @flip-left-end="updatePage" @flip-right-end="updatePage" v-slot="flipbook">
      <button id="left" class="page_button">
        <img :src="greatFlip.commonPath + '/left.png'" alt="leftButton" @click="handleLeftButtonClick(flipbook)">
      </button>
      <button id="right" class="page_button">
        <img :src="greatFlip.commonPath + '/right.png'" alt="rightButton" @click="handleRightButtonClick(flipbook)">
      </button>
    </Flipbook>
    <button id="quit">
      <img :src="greatFlip.commonPath + '/quit.png'" alt="quitButton" @click="handleQuitButtonClick">
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue';
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

    const greatNumber = ref(1);

    console.log("시작 페이지: " + greatNumber.value);

    // 컴포넌트가 마운트된 후에 GreatFlip 초기화 함수 실행
    onMounted(() => {
      // GreatFlip 클래스 초기화 작업이 완료된 후에 isGreatFlipLoaded 값을 true로 변경
      greatFlip.init().then(() => {
        isGreatFlipLoaded.value = true;
        nextTick().then(() => { // DOM 업데이트 사이클의 끝에서 실행
          console.log(`Current image is ${greatNumber.value}`);
        });
      });

    });

    const handleQuitButtonClick = () => {
      console.log('quit 버튼이 클릭되었습니다.');
      if (typeof window.Unity !== "undefined") {
        window.Unity.call("eBook");
      }
      else if (navigator.userAgent.indexOf("Win") != -1) {
        window.close();
      } else {
        console.log("has no Unity: " + navigator.userAgent.indexOf("Win"));
      }
    };

    const handleLeftButtonClick = (flipbook: any) => {
      flipbook.flipLeft();
    };

    const handleRightButtonClick = (flipbook: any) => {
      flipbook.flipRight();
    };

    const updatePage = (newPage: number) => {
      greatNumber.value = Math.floor(newPage / 2 + 1);
      console.log(`Current image is ${greatNumber.value}`);
    };

    return {
      greatFlip,
      isGreatFlipLoaded,
      handleQuitButtonClick,
      handleLeftButtonClick,
      handleRightButtonClick,
      updatePage
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

button {
  margin: 10px;
  padding: 0;
  z-index: 10;
  position: absolute;
  border: none;
  background-color: transparent;
  opacity: 0.5;
  cursor: pointer;
}

.page_button {
  width: 72px;
  height: 71px;
  width: 72px;
  height: 71px;
  top: 352px;
}

#quit {
  width: 72px;
  height: 76px;
  top: 0;
  bottom: 0;
  right: 0;
}

#left {
  left: 0;
  bottom: 0;
}

#right {
  bottom: 0;
  right: 0;
}
</style>
