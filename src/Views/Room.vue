<template>
  <div id="Room" class="flex flex-clo flex-jcc flex-ai">
    <div class="flex">
      <div class="side-view">
        <div class="user-view borbox">
          <div class="user-list borbox hidden">
            <User v-for="item in userList" :key="item.id" :userInfo="item" class="user" />
          </div>
        </div>
        <div class="chat-box borbox hidden">
          <div class="chat-list borbox hidden">
            <Chat v-for="item in chatList" :key="item.id" :chatInfo="item" class="chat" />
          </div>
          <div class="chat-input flex flex-ai">
            <FlatInput v-model:value="chatText" :placeholder="'说出你的答案'" size="small" class="flat-input" />
            <FlatButton size="small">回答</FlatButton>
          </div>
        </div>
      </div>
      <div class="drawing">
        <FlatTimer :size="50" class="flat-timer" />
        <div class="board">
          <div class="question flex flex-ai flex-jcc">
            <span class="current-question text-bold">{{ currentQuestion }}</span>
            <i class="icon iconfont icon-refresh pointer"></i>
          </div>
          <div class="board-area hidden">
            <Board :lineWidth="diameter" :penColor="brushColor" :cursorType="'pen'" ref="board" />
          </div>
          <div class="bin flex flex-ai flex-jcc pointer" title="清除画布" @click="clearBoard">
            <i class="icon iconfont icon-bin"></i>
          </div>
        </div>
        <div class="brush-opt flex flex-ai borbox">
          <div
            class="eraser borbox circle flex flex-ai flex-jcc pointer"
            :class="useEraser && 'eraser-active'"
            title="橡皮擦"
            @click="selectEraser"
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
                :style="{ width: `${diameter}px`, height: `${diameter}px`, backgroundColor: brushColor }"
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
import { defineComponent, ref, Ref, computed, ComputedRef, reactive } from 'vue'
import FlatTimer from '/@components/FlatTimer.vue'
import FlatSlider from '/@components/FlatSlider.vue'
import FlatInput from '/@components/FlatInput.vue'
import FlatButton from '/@components/FlatButton.vue'
import Board from '/@components/Board.vue'
import User from '/@components/User.vue'
import Chat from '/@components/Chat.vue'
import { colorList } from '/@utils/publicData'
export default defineComponent({
  name: 'Room',
  setup() {
    const board = ref<InstanceType<typeof Board>>()
    const { useEraser, brushColor, lineWidth, selectEraser } = handleBrushOpt()
    const { currentQuestion } = handleQuestions()
    const { userList, getUserList } = handleUsers()
    const { chatList, getChatInfo, chatText } = handleChats()
    const diameter: ComputedRef<number> = computed(() => lineWidth.value * 2)
    const clearBoard = () => {
      board.value.clearCanvas()
    }
    getUserList()
    getChatInfo()
    return {
      brushColor,
      colorList,
      lineWidth,
      useEraser,
      selectEraser,
      currentQuestion,
      diameter,
      board,
      clearBoard,
      userList,
      getUserList,
      chatList,
      getChatInfo,
      chatText,
    }
  },
  components: {
    FlatTimer,
    FlatSlider,
    FlatInput,
    FlatButton,
    Board,
    User,
    Chat,
  },
})
function handleUsers() {
  type User = {
    id: number
    avatar: string
    name: string
    point: number
  }
  const userList: User[] = reactive([])
  const getUserList = () => {
    userList.push(
      ...[
        { id: 0, avatar: '14EWQE12E12EEQEQWEQE', name: 'Lee', point: 54 },
        { id: 1, avatar: '324h32uierhq98d21he', name: 'Rich', point: 105 },
        { id: 2, avatar: '324h32uierhq98d21he', name: 'Rich', point: 105 },
        { id: 3, avatar: '324h32uierhq98d21he', name: 'Rich', point: 105 },
        { id: 4, avatar: '324h32uierhq98d21he', name: 'Rich', point: 105 },
        { id: 5, avatar: '324h32uierhq98d21he', name: 'Rich', point: 105 },
        { id: 6, avatar: '324h32uierhq98d21he', name: 'Rich', point: 105 },
      ]
    )
  }
  return {
    userList,
    getUserList,
  }
}
function handleChats() {
  type Chat = {
    id: number
    text: string
    name: string
    avatar: string
    type: string // 'success'|''
  }
  const chatList: Chat[] = reactive([])
  const getChatInfo = () => {
    chatList.push(
      ...[
        { id: 0, text: '大象', name: 'Lee', avatar: '14EWQE12E12EEQEQWEQE' },
        { id: 1, text: '大象', name: 'Lee', avatar: '14EWQE12E12EEQEQWEQE' },
        { id: 2, text: '大象', name: 'Lee', avatar: '14EWQE12E12EEQEQWEQE' },
        { id: 3, text: '大象', name: 'Lee', avatar: '14EWQE12E12EEQEQWEQE' },
        { id: 4, text: '大象', name: 'Lee', avatar: '14EWQE12E12EEQEQWEQE' },
        { id: 5, text: '大象', name: 'Lee', avatar: '14EWQE12E12EEQEQWEQE' },
        { id: 6, text: '大象', name: 'Lee', avatar: '14EWQE12E12EEQEQWEQE' },
      ]
    )
  }
  const chatText: Ref<string> = ref('')

  return {
    chatList,
    getChatInfo,
    chatText,
  }
}
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
  const selectEraser = () => {
    useEraser.value = !useEraser.value
    brushColor.value = '#F2F2F2'
  }
  return {
    lineWidth,
    brushColor,
    useEraser,
    selectEraser,
  }
}
</script>
<style lang="scss" scoped>
#Room {
  width: 100%;
  height: calc(100% - 50px);
  .side-view {
    width: 200px;
    margin-right: 10px;
    .user-view,
    .chat-box {
      background-color: $White;
      box-shadow: $PrimaryShadow;
      border-radius: 20px;
    }
    .user-view {
      width: 100%;
      height: 260px;
      margin-bottom: 10px;
      padding: 15px 0;
      .user-list {
        height: 100%;
        padding: 0 15px;
        overflow-y: auto;
        .user {
          &:not(:last-child) {
            margin-bottom: 15px;
          }
        }
      }
    }
    .chat-box {
      width: 100%;
      height: 270px;
      padding: 10px;
      .chat-list {
        height: 200px;
        background-color: #f8f8f8;
        border-radius: 10px;
        padding: 15px 10px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 6px;
        }
        &::-webkit-scrollbar-track {
          background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #f0f0f0;
          border-radius: 8px;
          border: 1px solid transparent;
          padding: 5px;
        }
        &::-webkit-scrollbar-thumb:hover {
          background-color: #5cdbd3;
        }
        .chat {
          &:not(:last-child) {
            margin-bottom: 10px;
          }
        }
      }
      .chat-input {
        margin-top: 10px;
        .flat-input {
          width: 120px;
          margin-right: 5px;
        }
      }
    }
  }
  .drawing {
    width: 650px;
    position: relative;
    .flat-timer {
      position: absolute;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      z-index: 10;
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
