<template>
  <div class="game-room flex flex-jcc flex-aic">
    <main>
      <!-- 房间选项：退出、查看房间信息 -->
      <div class="room-opts">
        <flat-button
          icon
          icon-class="icon iconfont icon-exit"
          type="danger"
          @click="quitModalVisible = true"
        ></flat-button>
        <flat-button
          icon
          icon-class="icon iconfont icon-info"
          type="default"
          @click="infoModalVisible = true"
        ></flat-button>
      </div>
      <!-- 游戏区域 -->
      <div class="game-field">
        <div class="timer-box" v-show="curLimitTime > 0">
          <timer
            ref="timer"
            :state="roomState"
            :isDrawer="isDrawer"
            :limitTime="curLimitTime"
            @timerEnd="onTimerEnd"
          ></timer>
        </div>
        <!-- 等待其他玩家进入 -->
        <div
          class="wait-players flex flex-col flex-aic flex-jcc"
          v-if="playerList.length < 2 && roomState === 0"
        >
          <loader size="small"></loader>
          <span class="loader-content">等待其他玩家进入</span>
        </div>
        <!-- 绘画区域，画板，清除画板 -->
        <div class="drawing-field flex flex-col" v-else-if="roomState === 1">
          <div class="board-header">
            <div class="cur-qes flex flex-aic flex-jcc" v-if="isDrawer">
              <span class="qes-text">{{ curSelectQes.goods }}</span>
            </div>
          </div>
          <div class="board-area flex-1">
            <drawing-board
              ref="board"
              :color="curColor"
              :line-width="curWeight"
              :prevent="!isDrawer"
              @drawing="onDrawing"
            ></drawing-board>
          </div>
          <div class="board-footer">
            <Toolbar
              @selectColor="onSelectColor"
              @changeWeight="onChangeWeight"
              @clear="clearBoard"
              v-if="isDrawer"
            ></Toolbar>
          </div>
        </div>
        <!-- 新的回合：选题/等待玩家选题 -->
        <div class="new-turn" v-else-if="roomState === 2">
          <!-- 选择题目/放弃回合 -->
          <div class="choose-your-qes flex flex-col flex-aic" v-if="isDrawer">
            <span class="first-title">你的回合开始啦！</span>
            <span class="sub-title">请选择你的题目：</span>
            <span class="choose-describe">(时间到了没有选择题目视为放弃回合)</span>
            <div class="qes-list">
              <theme
                v-for="item in prepareQesList"
                :key="item.id"
                :text="item.goods"
                :selected="curSelectQes.id === item.id"
                @click="curSelectQes = item"
                class="qes"
              ></theme>
            </div>
            <flat-button
              class="choose-btn"
              size="xLarge"
              shadow
              :loading="chooseQesLoading"
              @click="chooseQuestion"
            >选好了！</flat-button>
            <flat-button
              class="give-up-btn"
              type="danger"
              size="xLarge"
              shadow
              :loading="giveUpLoading"
              @click="giveUpThisTurn"
            >放弃回合</flat-button>
          </div>
          <!-- 等待玩家选题 -->
          <div class="wait-choose flex flex-col flex-aic flex-jcc" v-else>
            <loader size="small"></loader>
            <span class="loader-content">
              <span>玩家</span>
              <span class="player-name">{{ drawerName }}</span>
              <span>选题中</span>
            </span>
          </div>
        </div>
        <!-- 当前绘画结束，玩家评价👍/👎 -->
        <div class="answer-and-evaluate flex flex-col flex-aic" v-else-if="roomState === 3">
          <span class="first-title">答案是：{{ curAnswer }}！</span>
          <span class="sub-title" v-if="isDrawer">等待玩家们对你的画作做出评价</span>
          <span class="sub-title" v-else>你对该画作满意么</span>
          <div class="evaluate-btn flex flex-jcb">
            <div class="evaluate-zan flex flex-col flex-aic">
              <span>{{ zanNum }}</span>
              <like-button
                icon-class="icon iconfont icon-zan"
                :active="isZan"
                :disabled="isEvaluate || isDrawer"
                @click="onZan"
              ></like-button>
            </div>
            <div class="evaluate-cai flex flex-col flex-aic">
              <span>{{ caiNum }}</span>
              <like-button
                icon-class="icon iconfont icon-cai"
                type="danger"
                :active="isCai"
                @click="onCai"
                :disabled="isEvaluate || isDrawer"
              ></like-button>
            </div>
          </div>
        </div>
        <!-- 玩家放弃出题，下个玩家准备选题 -->
        <div class="give-up flex flex-col flex-aic flex-jcc" v-else-if="roomState === 4">
          <loader size="small"></loader>
          <span class="loader-content">
            <template v-if="isDrawer">
              <span>你放弃了出题，下个玩家准备选题</span>
            </template>
            <template v-else>
              <span>玩家</span>
              <span class="player-name">{{ drawerName }}</span>
              <span>放弃出题，下个玩家准备选题</span>
            </template>
          </span>
        </div>
        <!-- 整局游戏结束，展示前三名 -->
        <div class="game-over flex flex-col flex-aic" v-else-if="roomState === 5">
          <span class="title">游戏结束</span>
          <div class="rank-list">
            <div
              class="flex flex-col flex-aic"
              v-for="(player, index) in rankingList"
              :key="player.uid"
              :class="`rank-${index + 1}`"
            >
              <img
                class="medal"
                :src="`/public/images/rank-${index + 1}.svg`"
                :alt="`第${index + 1}`"
              />
              <avatar :avatar="player.image"></avatar>
              <carousel
                custom-class="player-name"
                font-size="24"
                :text="player.userName"
                center
                font-weight="bold"
              ></carousel>
            </div>
          </div>
        </div>
      </div>
      <!-- 信息栏 -->
      <div class="chat-field">
        <message-box ref="messageList" :messages="messages"></message-box>
        <div class="message-send flex">
          <flat-input
            class="flex-1 message-input"
            v-model="playerAnswer"
            :placeholder="stateText[roomState]"
            :disabled="roomState !== 1 || isDrawer || guessRight"
          ></flat-input>
          <flat-button
            class="flex-sh message-btn"
            style="font-size:14px"
            v-if="roomState === 1 && !guessRight && !isDrawer"
            @click="sendAnswer"
            :disabled="!playerAnswer"
          >发送</flat-button>
        </div>
      </div>
      <!-- 玩家列表 -->
      <div class="player-field">
        <div class="player-content">
          <div class="player-list flex flex-col">
            <player v-for="item in playerList" :key="item.uid" :player="item" :drawer="drawer"></player>
          </div>
        </div>
      </div>
    </main>
    <!-- 房间信息modal -->
    <flat-modal
      v-model="infoModalVisible"
      title="房间信息"
      :show-footer="false"
      :close-on-click-screen="false"
    >
      <ul class="flex flex-col">
        <li class="flex flex-jcb">
          <span>房间名</span>
          <span>{{ roomInfo.roomName }}</span>
        </li>
        <li class="flex flex-jcb">
          <span>主题</span>
          <span>{{ themeList[roomInfo.tid].label }}</span>
        </li>
        <li class="flex flex-jcb">
          <span>人数上限</span>
          <span>{{ roomInfo.max }}</span>
        </li>
        <li class="flex flex-jcb">
          <span>分数上限</span>
          <span>{{ roomInfo.accumulate }}</span>
        </li>
      </ul>
    </flat-modal>
    <!-- 退出房间前提示modal -->
    <flat-modal v-model="quitModalVisible" @confirm="quitRoom">
      <span>确认退出房间么？</span>
    </flat-modal>
  </div>
</template>

<script setup lang="ts">
import FlatButton from '@components/FlatButton.vue'
import FlatInput from '@components/FlatInput.vue'
import FlatModal from '@components/FlatModal.vue'
import Loader from '@components/Loader.vue'
import Timer from '@components/Timer.vue'
import DrawingBoard from '@components/DrawingBoard.vue'
import Toolbar from '@components/Toolbar.vue'
import Theme from '@components/Theme.vue'
import LikeButton from '@components/LikeButton.vue'
import Player from '@components/Player.vue'
import Avatar from '@components/Avatar.vue'
import Carousel from '@components/Carousel.vue'
import MessageBox from '@components/MessageBox.vue'

import { reactive, ref, nextTick, watch, computed, inject, ComponentInternalInstance, getCurrentInstance, onBeforeUnmount } from 'vue'
import router from '@router/index'
import { useRoute } from 'vue-router'
import { stateName } from '@/store'
import { FreeObjT, RoomT, HexT, PlayerT, GlobalStateT, MessageT } from '@/@types'
import { themeList } from '@utils/publicData'

const vm: ComponentInternalInstance | null = getCurrentInstance()
const ws = vm!.appContext.config.globalProperties.$ws
const globalState = <GlobalStateT>inject(stateName)
const route = useRoute()

/**
 * 0：等待玩家进入 ?s
 * 1：玩家绘画/查看玩家绘画 150s
 * 2：玩家选题/等待玩家选题 30s
 * 3：公布答案并评价/查看评价 15s
 * 4：玩家放弃出题/放弃出题 10s
 * 5：游戏结束 30s
 */
const roomState = ref<number>(0)
const stateDelay: number[] = [0, 50, 15, 15, 10, 30]
const curLimitTime = computed(() => {
  return stateDelay[roomState.value]
})
const playerList = reactive<PlayerT[]>([])
const params = route.params

const drawer = ref<number>(JSON.parse(params.drawer as string))
const drawerName = ref<string>('')
const players: PlayerT[] = JSON.parse(params.players as string)
const roomInfo: RoomT = JSON.parse(params.roomInfo as string)
const isDrawer = computed(() => {
  return drawer.value === globalState.userId
})

// 玩家中途进入页面回收到当前倒计时时间戳，收到之后将getRestTime置为true
let getRestTime = false

interface timerT extends HTMLElement {
  clearTimer(): void
  setRestTime(newTime: number): void
  resetTimer(): void
}
const timer = ref<null | timerT>(null)

// 设置倒计时剩余时间
const setRestTime = (date) => {
  nextTick(() => {
    if (typeof date === 'number') {
      const delay = (Date.now() - date) / 1000;
      (timer.value as timerT).setRestTime(curLimitTime.value - parseInt(delay + ''))
    }
  })
}

playerList.splice(0, playerList.length, ...players)

// 根据玩家id找到玩家名
const getPlayerName = (id: number) => {
  for (let i = 0;i < playerList.length;i++) {
    const player = playerList[i]
    if (id === player.uid) {
      return player.userName
    }
  }
  return ''
}
// 设置初始绘画玩家名
drawerName.value = getPlayerName(drawer.value)

// 信息栏列表
const messages = reactive<MessageT[]>([])
interface messageListT extends HTMLElement {
  scrollToBottom(): void
}
const messageList = ref<null | messageListT>(null)

// 玩家是否猜对了当前题目
const guessRight = ref<boolean>(false)

// 房间状态对应信息栏输入框中显示的placeholder
const stateText = computed<string[]>(() => {
  return [
    '等待玩家中',
    isDrawer.value ? '你的回合' : guessRight.value ? '你已猜对答案' : '你的答案是？',
    isDrawer.value ? '请选择题目' : '等待玩家选题',
    '评价时间到',
    '等待下个玩家',
    '游戏结束',
  ]
})

// 有玩家进入后，在信息栏提示，并在推入玩家列表中
ws.subscribeEvent('enterRoom', (resp: FreeObjT) => {
  const newPlayer: PlayerT = resp.data
  messages.push({
    content: `玩家${newPlayer.userName}已加入房间!`,
    type: 'newPlayer'
  })
  playerList.push(newPlayer)
})

// 其他玩家退出房间，修改玩家列表
ws.subscribeEvent('quitRoom', (resp: FreeObjT) => {
  for (let i = 0;i < playerList.length;i++) {
    const player = playerList[i]
    if (resp.data === player.uid) {
      messages.push({
        content: `玩家${player.userName}已退出房间`,
        type: 'playerQuit'
      })
      playerList.splice(i, 1)
    }
  }
})

// 房间只剩下一个人的时候，房间状态变为等待中，当前绘画者id置为-1，唯一一名玩家的分数重置为0
ws.subscribeEvent('waitPlayer', (resp: FreeObjT) => {
  roomState.value = 0
  drawer.value = -1
  playerList[0].point = 0
})

// 当前备选题目
const prepareQesList = reactive<FreeObjT[]>([])
// 当前选中的题目
const curSelectQes = ref<FreeObjT>({})

// 出题玩家变化，改变房间状态，倒计时30s
ws.subscribeEvent('waitChooseQuestion', (resp: FreeObjT) => {
  drawer.value = resp.drawer
  drawerName.value = getPlayerName(drawer.value)
  if (roomState.value === 2) {
    (timer.value as timerT).resetTimer
  } else {
    roomState.value = 2
    if (getRestTime) {
      setRestTime(resp.data)
      getRestTime = true
    }
  }
})

// 玩家选择题目
const chooseQesLoading = ref<boolean>(false)
const chooseQuestion = () => {
  chooseQesLoading.value = true
  ws.send({
    type: 'chooseQuestion',
    data: curSelectQes.value.goods,
    roomId: roomInfo.roomId
  })
}

// 玩家自己开始选题，获取选题内容，默认第一题选中
ws.subscribeEvent('chooseQuestion', (resp: FreeObjT) => {
  chooseQesLoading.value = false
  prepareQesList.splice(0, prepareQesList.length, ...resp.data)
  curSelectQes.value = prepareQesList[0]
  drawer.value = resp.drawer
  drawerName.value = getPlayerName(drawer.value)
  roomState.value = 2
})

const giveUpLoading = ref<boolean>(false)
// 玩家放弃出题，将房间状态改变，显示提示文字；并且通知后端准备进行下一轮玩家选题
const giveUpThisTurn = () => {
  giveUpLoading.value = true
  ws.send({ type: 'waitGiveUp', roomId: roomInfo.roomId, send: globalState.userId })
  roomState.value = 4
}

// 有玩家放弃出题的时候，房间状态变为等待过渡时间
ws.subscribeEvent('waitGiveUp', (resp: FreeObjT) => {
  giveUpLoading.value = false
  if (roomState.value === 4) {
    (timer.value as timerT).resetTimer
  } else {
    roomState.value = 4
    if (getRestTime) {
      setRestTime(resp.data)
      getRestTime = true
    }
  }
})

// 玩家开始绘画/其他玩家观看绘画
ws.subscribeEvent('waitDrawing', (resp: FreeObjT) => {
  if (roomState.value === 1) {
    (timer.value as timerT).resetTimer
  } else {
    roomState.value = 1
    if (getRestTime) {
      setRestTime(resp.data)
      getRestTime = true
    }
  }
})

const playerAnswer = ref<string>('')
// 玩家输入答案发送
const sendAnswer = () => {
  ws.send({
    type: 'sendInfo',
    roomId: roomInfo.roomId,
    send: globalState.userId,
    data: playerAnswer.value
  })
  playerAnswer.value = ''
}
// 接收到有人发送了信息，推入到messages中
ws.subscribeEvent('sendInfo', (resp: FreeObjT) => {
  const { data, send, bol } = resp
  const name = getPlayerName(send)
  if (bol) {
    const isOwn = send === globalState.userId
    guessRight.value = isOwn
    messages.push({
      id: send,
      content: isOwn ? '你猜对了答案！' : `玩家${name}猜对了答案！`,
      type: 'rightAnswer',
    })
  } else {
    const isOwn = globalState.userId === send
    messages.push({ id: send, name, content: data, type: 'answer', isOwn })
  }
})

ws.subscribeEvent('receivePlayerPoint', (resp: FreeObjT) => {
  const { data } = resp
  for (let i = 0;i < playerList.length;i++) {
    const player = playerList[i]
    if (data.uid === player.uid) {
      player.point = data.point
    }
  }
})

// 当前线宽，颜色，对画板操作
const curColor = ref<HexT | string>('')
const onSelectColor = (color: string) => {
  curColor.value = color
}
const curWeight = ref<number>(0)
const onChangeWeight = (weight: number) => {
  curWeight.value = weight
}
interface boardT extends HTMLElement {
  clearCanvas(): void
  drawCanvas(info: string): void
}
const board = ref<null | boardT>(null)

// 清除画板
const clearBoard = () => {
  (board.value as boardT).clearCanvas()
  ws.send({ type: 'clearCanvas', roomId: roomInfo.roomId })
}
ws.subscribeEvent('clearCanvas', (resp: FreeObjT) => {
  (board.value as boardT).clearCanvas()
})
// 用户绘画的时候发送路径
const onDrawing = (drawingInfo: FreeObjT) => {
  ws.send({
    type: 'sendCanvas',
    data: JSON.stringify(drawingInfo),
    roomId: roomInfo.roomId
  })
}
// 接收到路径的时候进行绘画
ws.subscribeEvent('sendCanvas', (resp: FreeObjT) => {
  (board.value as boardT).drawCanvas(resp.data)
})

// 玩家中途加入，有可能收到：canvas路径、当前绘画者
ws.subscribeEvent('joinInMiddle', (resp: FreeObjT) => {
  drawer.value = resp.drawer
  drawerName.value = getPlayerName(drawer.value)
  const pathList = resp.data
  pathList.forEach((path: string) => {
    (board.value as boardT).drawCanvas(path)
  })
})

// 每次发送新消息，信息栏都滚动到最底部
watch(() => messages.length, () => {
  (messageList.value as messageListT).scrollToBottom()
})

// 显示答案，玩家评价
const curAnswer = ref<string>('')
// 获取答案公布
ws.subscribeEvent('publishAnswer', (resp: FreeObjT) => {
  curAnswer.value = resp.data
})
// 开始评价环节
ws.subscribeEvent('evaluate', (resp: FreeObjT) => {
  if (roomState.value === 3) {
    (timer.value as timerT).resetTimer
  } else {
    roomState.value = 3
    if (getRestTime) {
      setRestTime(resp.data)
      getRestTime = true
    }
  }
})

const zanNum = ref<number>(0)
const caiNum = ref<number>(0)
const isZan = ref<boolean>(false)
const isCai = ref<boolean>(false)
const isEvaluate = ref<boolean>(false)
// 点赞
const onZan = () => {
  isZan.value = true
  isEvaluate.value = true
  ws.send({ type: 'zanOrCai', data: 'good', roomId: roomInfo.roomId })
}
// 点踩
const onCai = () => {
  isCai.value = true
  isEvaluate.value = true
  ws.send({ type: 'zanOrCai', data: 'bad', roomId: roomInfo.roomId })
}
// 用户点赞或者点踩接受新的信息
ws.subscribeEvent('zanOrCai', (resp: FreeObjT) => {
  const { bol, data } = resp
  if (bol) {
    zanNum.value = data
  } else {
    caiNum.value = data
  }
})

// 游戏结束，展示排名信息
const rankingList = ref<PlayerT[]>([])

watch(() => roomState.value, (newState) => {
  switch (newState) {
    case 2: {
      rankingList.value = []
      zanNum.value = 0
      caiNum.value = 0
      isZan.value = false
      isCai.value = false
      isEvaluate.value = false
      curAnswer.value = ''
      guessRight.value = false
    }
  }
})

// 在计时结束的时候进行后续操作
let onTimerEnd = () => {
  switch (roomState.value) {
    case 4: {
      if (isDrawer.value) {
        ws.send({ type: 'nextPlayer', roomId: roomInfo.roomId, send: globalState.userId })
      }
      break
    }
    case 1: {
      if (isDrawer.value) {
        ws.send({ type: 'evaluate', roomId: roomInfo.roomId })
      }
      break
    }
    case 2: {
      if (isDrawer.value) {
        ws.send({ type: 'waitGiveUp', roomId: roomInfo.roomId })
      }
      break
    }
    case 3: {
      if (isDrawer.value) {
        ws.send({ type: 'nextPlayer', roomId: roomInfo.roomId, send: globalState.userId, })
      }
      break
    }
    case 5: {
      playerList.forEach((player: PlayerT) => {
        player.point = 0
      })
      break
    }
  }
}

ws.subscribeEvent('endOfGame', (resp: FreeObjT) => {
  const list = resp.data
  rankingList.value = list
  if (roomState.value === 5) {
    (timer.value as timerT).resetTimer
  } else {
    roomState.value = 5
    if (getRestTime) {
      setRestTime(resp.data)
      getRestTime = true
    }
  }
})

// 房间信息modal
const infoModalVisible = ref<boolean>(false)

// 退出房间
const quitModalVisible = ref<boolean>(false)
const isQuit = ref<boolean>(false)
const quitRoom = () => {
  quitModalVisible.value = false
  isQuit.value = true
  router.replace('/')
  ws.send({
    type: 'quitRoom',
    send: globalState.userId,
    roomId: roomInfo.roomId
  })
}

const beforeunloadCallback = (e: BeforeUnloadEvent) => {
  e.preventDefault()
  e.returnValue = ''
}
window.addEventListener('beforeunload', beforeunloadCallback)

onBeforeUnmount(() => {
  ws.unsubscribeAll()
  window.removeEventListener('beforeunload', beforeunloadCallback);
  (timer.value as timerT).clearTimer()
  onTimerEnd = () => { }
  if (!isQuit.value) {
    quitRoom()
  }
  // 如果正常退出的时候玩家大于2，并且我是当前绘画者，那么直接进行下一轮
  if (playerList.length > 2 && isDrawer.value) {
    switch (roomState.value) {
      case 1:
      case 3:
      case 4: {
        if (isDrawer.value) {
          ws.send({ type: 'nextPlayer', roomId: roomInfo.roomId, send: globalState.userId })
        }
        break
      }
      case 2: {
        if (isDrawer.value) {
          console.log('2, nextPlayer')
          ws.send({ type: 'nextPlayer', roomId: roomInfo.roomId, send: globalState.userId })
        }
        break
      }
    }
  }
})
</script>

<style lang="scss">
.game-room {
  width: 100%;
  height: 100%;
  user-select: none;
  main {
    display: grid;
    gap: 15px;
    grid-template-columns: 180px 650px 200px;
    grid-template-areas:
      "a b c"
      "d b c";
    .room-opts,
    .player-field,
    .game-field,
    .chat-field {
      @extend .box-common-style;
    }
    .room-opts {
      height: 50px;
      padding: 0 15px;
      display: grid;
      grid-template-columns: repeat(3, max-content);
      column-gap: 15px;
      grid-area: a;
      align-items: center;
    }
    .game-field {
      grid-area: b;
      position: relative;
      padding: 15px 15px 0 15px;
      .wait-players {
        height: 100%;
        .loader-content {
          margin-top: 25px;
          font-size: 20px;
          color: $main;
        }
      }
      .timer-box {
        position: absolute;
        z-index: 500;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .drawing-field {
        width: 100%;
        height: 100%;
        .board-header {
          height: 60px;
          .cur-qes {
            position: absolute;
            top: 0;
            left: 0;
            background-color: $main;
            height: 40px;
            width: 150px;
            color: $light-1;
            font-size: 18px;
            border-radius: 16px 0 16px 0;
          }
        }
        .opts-bar {
          height: 50px;
          .drawer-opts {
            font-size: 18px;
            .zan,
            .cai {
              i {
                font-size: inherit;
                margin-left: 5px;
              }
            }
            .zan {
              color: $main;
              margin-right: 15px;
            }
            .cai {
              color: $red;
              i::before {
                display: inline-block;
                transform: rotate(180deg);
              }
            }
          }
        }
        .board-area {
          border-radius: 16px;
          overflow: hidden;
        }
        .board-footer {
          height: 60px;
        }
      }
      .new-turn {
        height: 100%;
        .choose-your-qes {
          height: 100%;
          color: $main;
          .first-title {
            font-size: 32px;
            font-weight: 600;
            margin-top: 65px;
          }
          .sub-title {
            font-size: 20px;
            margin-top: 15px;
          }
          .choose-describe {
            color: $light-5;
            font-size: 16px;
            margin-top: 10px;
          }
          .qes-list {
            width: 180px;
            margin-top: 35px;
            .qes {
              margin-bottom: 15px;
            }
          }
          .choose-btn {
            width: 180px;
            font-size: 16px;
            margin-bottom: 15px;
          }
          .give-up-btn {
            width: 180px;
            font-size: 16px;
          }
        }
        .wait-choose {
          height: 100%;
          .loader-content {
            margin-top: 25px;
            font-size: 20px;
            color: $main;
            .player-name {
              color: $blue;
            }
          }
        }
      }
      .answer-and-evaluate {
        color: $main;
        font-weight: 600;
        margin-top: 65px;
        .first-title {
          font-size: 40px;
        }
        .sub-title {
          font-size: 32px;
          margin-top: 30px;
        }
        .evaluate-btn {
          width: 400px;
          margin-top: 100px;
          .evaluate-zan > span {
            font-weight: 600;
            font-size: 24px;
            color: $blue;
            margin-bottom: 15px;
          }
          .evaluate-cai > span {
            font-weight: 600;
            font-size: 24px;
            color: $red;
            margin-bottom: 15px;
          }
        }
      }
      .give-up {
        height: 100%;
        .loader-content {
          margin-top: 25px;
          font-size: 20px;
          color: $main;
          .player-name {
            color: $blue;
          }
        }
      }
      .game-over {
        color: $main;
        font-weight: 600;
        margin-top: 65px;
        .title {
          font-size: 40px;
        }
        .rank-list {
          margin-top: 25px;
          display: grid;
          grid-template-columns: 130px 160px 130px;
          column-gap: 35px;
          grid-template-rows: 70px 250px;
          grid-template-areas:
            ". a ."
            "b a c";
          .rank-1 {
            grid-area: a;
            .medal {
              height: 70px;
              width: 70px;
              margin-bottom: -20px;
              position: relative;
            }
          }
          .rank-2 {
            grid-area: b;
          }
          .rank-3 {
            grid-area: c;
          }
          .rank-2,
          .rank-3 {
            .medal {
              height: 55px;
              width: 55px;
              margin-bottom: -15px;
              position: relative;
            }
          }
          .player-name {
            width: 100%;
            margin-top: 10px;
          }
        }
      }
    }
    .chat-field {
      padding: 10px 5px;
      grid-area: c;
    }
    .player-field {
      height: 535px;
      grid-area: d;
      padding: 15px 5px 15px 10px;
      .player-content {
        height: 100%;
        position: relative;
        @extend .scroll-list-margin-fade;
        .player-list {
          height: 100%;
          overflow: auto;
          @extend .scroll-bar;
        }
      }
    }
  }
}
.room-info-list {
  ul > li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
}
</style>