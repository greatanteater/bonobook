<template>
  <div class="great-flip">
    <Flipbook v-if="isGreatFlipLoaded" class="flipbook" :pages="greatFlip.getPages()" :flip-duration="flipDuration"
      :gloss="0" :perspective="6500" :nPolygons="10" :clickToZoom="false" v-slot="flipbook" ref="flipbookRef"
      @mousedown="flipStart" @mousemove="flipMove" @mouseup="flipEnd" @touchstart="flipStart" @touchmove="flipMove"
      @touchend="flipEnd" @flip-left-start="greatFlip.rustilingSoundPlay()"
      @flip-right-start="greatFlip.rustilingSoundPlay()" @flip-left-end="updatePage" @flip-right-end="updatePage">
      <button id="left" class="page_button" @click.prevent.stop.capture="leftButtonClick(flipbook)">
        <img :src="greatFlip.commonPath + '/left.png'" alt="leftButton">
      </button>
      <button id="right" class="page_button" @click.prevent.stop.capture="rightButtonClick(flipbook)">
        <img :src="greatFlip.commonPath + '/right.png'" alt="rightButton">
      </button>
    </Flipbook>
    <button id="quit" @click.prevent.stop.capture="quitButtonClick">
      <img :src="greatFlip.commonPath + '/quit.png'" alt="quitButton">
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import Flipbook from 'flipbook-vue';
import GreatFlip from '@/activity/scene/GreatFlip';

const greatFlip = new GreatFlip(); // GreatFlip 클래스 인스턴스 생성
const isGreatFlipLoaded = ref(false); // GreatFlip 클래스 로드 여부를 나타내는 변수
const greatNumber = ref(1);
const currentTime = ref(0);
const flipbookRef = ref(null);
const flipDuration = 500;

let auto = false;
let flipping = false;
let touchPoint = 0;

let observer: ResizeObserver | null = null;
let element: Element | null = null;

console.log("시작 이미지: " + greatNumber.value);

// 컴포넌트가 마운트된 후에 GreatFlip 초기화 함수 실행
onMounted(() => {
  // GreatFlip 클래스 초기화 작업이 완료된 후에 isGreatFlipLoaded 값을 true로 변경
  greatFlip.init().then(() => {
    isGreatFlipLoaded.value = true;
    nextTick().then(() => { // DOM 업데이트 사이클의 끝에서 실행
      shadow('none');
      leftButtonStyle(false);
      timeCheck();
      console.log(`Current image is ${greatNumber.value}`);
      greatFlip.playSound();
      focus();
      shadowNoneCheck();
    });
  });
});

onUnmounted(() => {
  greatFlip.clearSound();
  stopObserving();
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
    shadow('none');
    leftButtonStyle(false);
  } else if (greatNumber.value < lastImageNumber) {
    shadow('block');
    leftButtonStyle(true);
    rightButtonStyle(true);
  } else {
    shadow('none');
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
      const pages = document.querySelectorAll('.great-flip .page');
      if (pages.length > 1) {
        pages[0].classList.add('left-page');
        pages[1].classList.add('right-page');
      }
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

const flipStart = (event: MouseEvent | TouchEvent) => {
  flipping = true;
  const lastImageNumber = greatFlip.sync.length + 1;

  if (event instanceof TouchEvent) {
    touchPoint = event.touches[0].clientX;
  } else {
    touchPoint = event.clientX;
  }

  if (greatNumber.value == 2) {
    if (touchPoint < 650) {
      shadow('first');
    } else if (touchPoint > 650) {
      shadow('block');
    } else {
      shadow('none');
    }
  } else if (greatNumber.value == lastImageNumber - 1) {
    if (touchPoint < 650) {
      shadow('block');
    } else if (touchPoint > 650) {
      shadow('last');
    } else {
      shadow('none');
    }
  }
}

const flipMove = () => {
  if (flipping) {
    // element = document.querySelector('.flipbook .bounding-box');
    // if (element) {
    //   const rect = element.getBoundingClientRect();
    //   if (rect.width < 700) {
    //     shadow('none');
    //   } else {
    //     const lastImageNumber = greatFlip.sync.length + 1;
    //     if (greatNumber.value == 1) {
    //       shadow('first');
    //     } else if (greatNumber.value == 2) {
    //       shadow('first');
    //     } else if (greatNumber.value == lastImageNumber - 1) {
    //       shadow('last');
    //     } else if (greatNumber.value == lastImageNumber) {
    //       shadow('last');
    //     }
    //   }
    // }
    console.log("책 넘기는 중");
  }
}

const flipEnd = () => {
  flipping = false;
  console.log("다 넘김");
  const lastImageNumber = greatFlip.sync.length + 1;
  if (greatNumber.value == 2 || greatNumber.value == lastImageNumber - 1) {
    shadow('block');
  }
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

const shadow = (order: string) => {
  const style = document.createElement('style');
  let display = '';
  let left = '';
  let right = '';
  if (order == 'first') {
    display = 'block';
    left = 'auto';
    right = '625px';
  } else if (order == 'last') {
    display = 'block';
    left = '625px';
    right = 'auto';
  } else if (order == 'block') {
    display = 'block';
    left = '625px';
    right = 'auto';
  } else {
    display = 'none';
  }
  style.innerHTML = `
  .flipbook .bounding-box::before {
    display: ${display};
    left: ${left};
    right: ${right};
  }
`;
  document.head.appendChild(style);
}

const shadowNoneCheck = () => {
  element = document.querySelector('.flipbook .bounding-box');

  observer = new ResizeObserver(entries => {
    for (let entry of entries) {
      // console.log(`Current width: ${entry.contentRect.width}px`);
      if (entry.contentRect.width < 800) {
        shadow('none');
      } else {
        const lastImageNumber = greatFlip.sync.length + 1;
        if (greatNumber.value == 1) {
          shadow('first');
        } else if (greatNumber.value == 2) {
          shadow('first');
        } else if (greatNumber.value == lastImageNumber - 1) {
          shadow('last');
        } else if (greatNumber.value == lastImageNumber) {
          shadow('last');
        }
      }
    }
  });

  if (element) observer.observe(element);
}

const stopObserving = () => {
  if (observer && element) {
    observer.unobserve(element);
    observer = null;
    element = null;
  }
}
</script>

<style>
.great-flip {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
}

.flipbook {
  width: 100%;
  height: 100%;
}

.flipbook .bounding-box {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.flipbook .bounding-box::before {
  content: "";
  position: absolute;
  display: block;
  left: auto;
  right: 625px;
  top: 0;
  width: 50px;
  height: 100%;
  opacity: 0.3;
  z-index: 10;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.001) 0%, rgba(0, 0, 0, 0.3) 35%, rgba(0, 0, 0, 0.5) 48%, rgba(0, 0, 0, 0.1) 52%, rgba(0, 0, 0, 0.001) 100%);
  z-index: 80;
}

/* .left-page {
  border-right: 1px solid rgb(83, 83, 83); box-sizing: border-box;
} */

.flipbook-container {
  z-index: 1;
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
  top: 352px;
}

#quit {
  width: 72px;
  height: 76px;
  top: 0px;
  bottom: 0px;
  right: 0px;
}

#left {
  left: 0px;
  bottom: 0px;
}

#right {
  bottom: 0px;
  right: 0px;
}
</style>
