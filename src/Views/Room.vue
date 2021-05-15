<template>
  <div id="Room" class="flex flex-clo flex-jcc flex-ai">
    <div class="flex">
      <div class="side-view">
        <div class="user"></div>
        <div class="chat"></div>
      </div>
      <div class="drawing">
        <FlatTimer :size="50" class="flat-timer" />
        <div class="board">
          <div class="question flex flex-ai flex-jcc">
            <span class="current-question text-bold">{{ currentQuestion }}</span>
            <i class="icon iconfont icon-refresh pointer"></i>
          </div>
          <div class="board-area hidden">
            <Board />
          </div>
          <div class="bin flex flex-ai flex-jcc pointer" title="清除画布">
            <i class="icon iconfont icon-bin"></i>
          </div>
        </div>
        <div class="brush-opt flex flex-ai borbox">
          <div
            class="eraser borbox circle flex flex-ai flex-jcc pointer"
            :class="useEraser && 'eraser-active'"
            title="橡皮擦"
            @click="useEraser = !useEraser"
          >
            <i class="icon iconfont icon-eraser"></i>
          </div>
          <div
            class="color circle borbox pointer"
            v-for="(item, index) in colorList"
            :key="index"
            :style="{ backgroundColor: item }"
            :class="brushColor === item && 'color-active'"
            @click="brushColor = item"
          ></div>
          <div class="line-width flex flex-ai" title="画笔尺寸">
            <div class="preview-pack flex flex-ai flex-jcc flex-clo">
              <div
                class="width-preview circle"
                :style="{ width: `${lineWidth * 2}px`, height: `${lineWidth * 2}px`, backgroundColor: brushColor }"
              ></div>
            </div>
            <FlatSlider class="slider" :min="2" :max="10" v-model:value="lineWidth" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import FlatTimer from '/@components/FlatTimer.vue'
import FlatSlider from '/@components/FlatSlider.vue'
import Board from '/@components/Board.vue'
import { colorList } from '/@utils/publicData'
export default defineComponent({
  name: 'Room',
  setup() {
    const { useEraser, brushColor, lineWidth } = handleBrushOpt()
    const { currentQuestion } = handleQuestions()
    return {
      brushColor,
      colorList,
      lineWidth,
      useEraser,
      currentQuestion,
    }
  },
  components: {
    FlatTimer,
    FlatSlider,
    Board,
  },
})
function handleQuestions() {
  const currentQuestion: Ref<string> = ref('苹果')
  const getNextQuestion = () => {}
  return {
    currentQuestion,
    getNextQuestion,
  }
}
function handleBrushOpt() {
  const useEraser: Ref<boolean> = ref(false)
  const brushColor: Ref<string> = ref(colorList[0])
  const lineWidth: Ref<number> = ref(4)
  return {
    lineWidth,
    brushColor,
    useEraser,
  }
}
</script>
<style lang="scss" scope>
#Room {
  width: 100%;
  height: calc(100% - 50px);
  .side-view {
    width: 200px;
    margin-right: 10px;
    .user,
    .chat {
      background-color: $White;
      box-shadow: $PrimaryShadow;
      border-radius: 20px;
    }
    .user {
      width: 100%;
      height: 280px;
      margin-bottom: 10px;
    }
    .chat {
      width: 100%;
      height: 250px;
    }
  }
  .drawing {
    width: 650px;
    position: relative;
    .flat-timer {
      position: absolute;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
    .board,
    .brush-opt {
      background-color: $White;
      box-shadow: $PrimaryShadow;
      border-radius: 20px;
    }
    .board {
      height: 480px;
      position: relative;
      .question {
        width: 150px;
        height: 40px;
        background-color: $Primary;
        color: $White;
        border-radius: 20px 0px 20px 0px;
        .current-question {
          font-size: 18px;
          margin-right: 5px;
        }
        i {
          font-size: 18px;
        }
      }
      .board-area {
        margin: 15px 0 0 15px;
        width: calc(100% - 30px);
        height: 380px;
        border-radius: 20px;
      }
      .bin {
        position: absolute;
        width: 80px;
        height: 30px;
        color: $White;
        opacity: 0.8;
        background-color: $Danger;
        border-radius: 20px 0px 20px 0px;
        right: 0;
        bottom: 0;
        i {
          font-size: 22px;
        }
        &:hover {
          opacity: 1;
        }
      }
    }
    .brush-opt {
      margin-top: 10px;
      height: 50px;
      padding: 0 20px;
      .eraser {
        width: 30px;
        height: 30px;
        color: $Primary;
        border: 1px solid $Primary;
        @include Transition(all, 0.3s, ease);
        margin-right: 15px;
        opacity: 0.7;
        i {
          font-size: 24px;
        }
        &:hover {
          opacity: 1;
        }
      }
      .eraser-active {
        box-shadow: $PrimaryShadow;
        background-color: $Primary;
        color: $White;
        opacity: 1;
      }
      .color {
        width: 30px;
        height: 30px;
        border: 2px solid $ShallowWhite;
        opacity: 0.7;
        @include Transition(all, 0.3s, ease);
        &:not(:last-child) {
          margin-right: 15px;
        }
        &:hover {
          opacity: 1;
        }
      }
      .color-active {
        opacity: 1;
        border: 2px solid $Primary;
        box-shadow: $PrimaryShadow;
        filter: brightness(100%);
      }
      .line-width {
        .preview-pack {
          width: 20px;
          height: 20px;
          .width-preview {
            margin-right: 10px;
          }
        }
        .slider {
          width: 150px;
        }
      }
    }
  }
}
</style>
