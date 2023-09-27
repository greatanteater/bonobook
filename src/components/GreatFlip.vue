<template>
  <div class="great-flip">
    <Flipbook v-if="isGreatFlipLoaded" class="flipbook" :pages="greatFlip.getPages()" :flip-duration="flipDuration"
      :gloss="0" :ambient="1" :clickToZoom="false" v-slot="flipbook" ref="flipbookRef"
      @mousedown.prevent.stop.capture="flipStart" @mousemove.prevent.stop.capture="flipMove"
      @mouseup.prevent.stop.capture="flipEnd" @touchstart.prevent.stop.capture="flipStart"
      @touchmove.prevent.stop.capture="flipMove" @touchend.prevent.stop.capture="flipEnd"
      @flip-left-start="greatFlip.rustilingSoundPlay()" @flip-right-start="greatFlip.rustilingSoundPlay()"
      @flip-left-end="updatePage" @flip-right-end="updatePage">
      <button id="left" class="page_button">
        <img :src="greatFlip.commonPath + '/left.png'" alt="leftButton"
          @click.prevent.stop.capture="leftButtonClick(flipbook)">
      </button>
      <button id="right" class="page_button">
        <img :src="greatFlip.commonPath + '/right.png'" alt="rightButton"
          @click.prevent.stop.capture="rightButtonClick(flipbook)">
      </button>
    </Flipbook>
    <button id="quit">
      <img :src="greatFlip.commonPath + '/quit.png'" alt="quitButton" @click.prevent.stop.capture="quitButtonClick">
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue';
import Flipbook from 'flipbook-vue';
import GreatFlip from '../activity/scene/GreatFlip';

export default defineComponent({
  components: {
    Flipbook,
  },
  setup() {
    const greatFlip = new GreatFlip(); // GreatFlip 클래스 인스턴스 생성
    const isGreatFlipLoaded = ref(false); // GreatFlip 클래스 로드 여부를 나타내는 변수
    const greatNumber = ref(1);
    const currentTime = ref(0);
    const flipbookRef = ref(null);
    const flipDuration = 1000;

    let auto = false;
    let flipping = false;

    console.log("시작 이미지: " + greatNumber.value);

    // 컴포넌트가 마운트된 후에 GreatFlip 초기화 함수 실행
    onMounted(() => {
      // GreatFlip 클래스 초기화 작업이 완료된 후에 isGreatFlipLoaded 값을 true로 변경
      greatFlip.init().then(() => {
        isGreatFlipLoaded.value = true;
        nextTick().then(() => { // DOM 업데이트 사이클의 끝에서 실행
          leftButtonStyle(false);
          timeCheck();
          console.log(`Current image is ${greatNumber.value}`);
          greatFlip.playSound();
          focus();
        });
      });
    });

    onUnmounted(() => {
      greatFlip.clearSound();
    });

    const quitButtonClick = () => {
      if (typeof window.Unity !== "undefined") {
        window.Unity.call("eBook");
      }
      else if (navigator.userAgent.indexOf("Win") != -1) {
        window.close();
      } else {
        console.log("has no Unity: " + navigator.userAgent.indexOf("Win"));
      }
    };

    const leftButtonClick = (flipbook: any) => {
      if (!flipping) {
        flipbook.flipLeft();
      }
    };

    const rightButtonClick = (flipbook: any) => {
      if (!flipping) {
        flipbook.flipRight();
      }
    };

    const autoPaging = (flipbook: any) => {
      if (!flipping) {
        auto = true;
        flipbook.flipRight();
      }
    }

    const updatePage = (newPage: number) => {
      greatNumber.value = Math.floor(newPage / 2 + 1);
      console.log(`Current image is ${greatNumber.value}`);

      const lastImageNumber = greatFlip.sync.length + 1;

      if (greatNumber.value <= 1) {
        leftButtonStyle(false);
      } else if (greatNumber.value < lastImageNumber) {
        leftButtonStyle(true);
        rightButtonStyle(true);
      } else {
        rightButtonStyle(false);
      }

      if (auto) {
        auto = false;
      } else {
        greatFlip.moveSound(greatNumber.value - 1);
      }
    };

    const timeCheck = () => {
      if (greatFlip.audio) {
        greatFlip.audio.addEventListener('timeupdate', () => {
          currentTime.value = greatFlip.audio ? greatFlip.audio.currentTime : 0;
          const time = currentTime.value;
          const number = greatNumber.value;
          if (time > greatFlip.sync[number] - flipDuration / 1000 && !flipping) {
            autoPaging(flipbookRef.value);
          }
        });
      }
    }

    const leftButtonStyle = (display: boolean) => {
      const leftButton = document.getElementById('left');
      if (leftButton != null) {
        if (display) {
          leftButton.style.display = 'block';
        } else {
          leftButton.style.display = 'none';
        }
      }
    }

    const rightButtonStyle = (display: boolean) => {
      const rightButton = document.getElementById('right');
      if (rightButton != null) {
        if (display) {
          rightButton.style.display = 'block';
        } else {
          rightButton.style.display = 'none';
        }
      }
    }

    const flipStart = () => {
      flipping = true;
    }

    const flipMove = () => {
      if (flipping) {
        console.log("책 넘기는 중");
      }
    }

    const flipEnd = () => {
      flipping = false;
      console.log("다 넘김");
    }

    const focus = () => {
      window.addEventListener('blur', () => {
        console.log("Window lost focus");
        greatFlip.stopSound();
      });

      window.addEventListener('focus', () => {
        console.log("Window gained focus");
        greatFlip.playSound();
      });
    }

    return {
      greatFlip,
      isGreatFlipLoaded,
      quitButtonClick,
      leftButtonClick,
      rightButtonClick,
      updatePage,
      flipbookRef,
      flipDuration,
      flipStart,
      flipMove,
      flipEnd
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
