<template>
  <div class="room flex flex-jcc flex-aic">
    <main>
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
        <flat-button icon icon-class="icon iconfont icon-share" type="primary" @click="shareLink"></flat-button>
      </div>
      <div class="game-field">
        <div class="timer-box">
          <timer></timer>
        </div>
        <div class="wait-players flex flex-col flex-aic flex-jcc" v-if="roomState === 0">
          <loader size="small"></loader>
          <span class="loader-content">等待玩家进入</span>
        </div>
        <div class="drawing-field flex flex-col" v-else-if="roomState === 1">
          <div class="cur-qes flex flex-aic flex-jcc">
            <span class="qes-text">苹果</span>
          </div>
          <div class="opts-bar flex flex-aic flex-jce">
            <div class="drawer-opts flex">
              <div class="zan">
                <span class="num">10</span>
                <i class="icon iconfont icon-zan"></i>
              </div>
              <div class="cai">
                <span class="num">10</span>
                <i class="icon iconfont icon-zan"></i>
              </div>
            </div>
            <!-- <div class="guesser-opts">

            </div>-->
          </div>
          <div class="board-area flex-1">
            <drawing-board ref="board" :color="curColor" :line-width="curWeight"></drawing-board>
          </div>
          <div class="board-footer">
            <Toolbar
              @selectColor="onSelectColor"
              @changeWeight="onChangeWeight"
              @clear="clearBoard"
            ></Toolbar>
          </div>
        </div>
        <div class="new-turn" v-else-if="roomState === 2">
          <!-- <div class="choose-your-qes flex flex-col flex-aic">
            <span class="first-title">你的回合开始啦！</span>
            <span class="sub-title">请选择你的题目：</span>
            <div class="qes-list">
              <theme
                v-for="item in prepareQesList"
                :key="item.value"
                :text="item.label"
                :selected="curSelectQes.value === item.value"
                @click="curSelectQes = item"
                class="qes"
              ></theme>
            </div>
            <flat-button class="choose-btn" size="xLarge" shadow>选好了！</flat-button>
          </div>-->
          <div class="wait-choose flex flex-col flex-aic flex-jcc">
            <loader size="small"></loader>
            <span class="loader-content">
              玩家
              <span class="player-name">player1</span>选题中
            </span>
          </div>
        </div>
        <div class="answer-and-evaluate flex flex-col flex-aic" v-else-if="roomState === 3">
          <span class="first-title">答案是：{{ curAnswer }}！</span>
          <span class="sub-title">你对该画作满意么？</span>
          <div class="evaluate-btn flex flex-jcb">
            <like-button icon-class="icon iconfont icon-zan" :active="isZan" @click="onZan"></like-button>
            <like-button
              icon-class="icon iconfont icon-cai"
              type="danger"
              :active="isCai"
              @click="onCai"
            ></like-button>
          </div>
        </div>
      </div>
      <div class="chat-field">
        <div class="message-box">
          <div class="message-list" ref="messageList">
            <transition-group name="slide">
              <div
                class="message flex flex-col flex-ais"
                v-for="(item, index) in messages"
                :key="index"
              >
                <span class="message-name">{{ item.name }}</span>
                <div class="message-content">
                  <span>{{ item.content }}</span>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
        <div class="message-send flex">
          <flat-input class="flex-1" :placeholder="stateText[roomState]" disabled></flat-input>
          <flat-button class="flex-sh" style="font-size:14px" v-if="roomState === 1">发送</flat-button>
        </div>
      </div>
      <div class="player-field">
        <div class="player-content">
          <div class="player-list">
            <div class="player flex" v-for="item in playerList" :key="item.id">
              <div class="avatar">
                <avatar :avatar="item.avatar"></avatar>
              </div>
              <div class="player-info flex flex-col flex-jcb flex-1 flex-ais">
                <div class="player-name">
                  <span>{{ item.name }}</span>
                </div>
                <div class="player-point">
                  <span>{{ item.point }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <flat-modal v-model="infoModalVisible" title="房间信息" :show-footer="false">
      <ul class="flex flex-col">
        <li>
          <span>房间名</span>
          <span>{{ roomInfo.name }}</span>
        </li>
        <li>
          <span>主题</span>
          <span>{{ roomInfo.theme }}</span>
        </li>
        <li>
          <span>房间人数</span>
          <span>{{ roomInfo.playerNum }}/{{ roomInfo.playerLimit }}</span>
        </li>
        <li>
          <span>分数上限</span>
          <span>{{ roomInfo.pointLimit }}</span>
        </li>
      </ul>
    </flat-modal>
    <flat-modal v-model="quitModalVisible" @confirm="quitRoom">
      <span>确认退出房间么？</span>
    </flat-modal>
  </div>
</template>

<script setup lang="ts">
import FlatButton from '@components/FlatButton.vue'
import FlatInput from '@components/FlatInput.vue'
import FlatModal from '@components/FlatModal.vue'
import Avatar from '@components/Avatar.vue'
import Loader from '@components/Loader.vue'
import Timer from '@components/Timer.vue'
import DrawingBoard from '@components/DrawingBoard.vue'
import Toolbar from '@components/Toolbar.vue'
import Theme from '@components/Theme.vue'
import LikeButton from '@components/LikeButton.vue'

import { reactive, ref, nextTick } from 'vue'
import { FreeObjT, HexT, ListItemT } from '../@types'
import { avatarData } from '../utils/publicData'
import { randomInteger, copyInfo } from '../utils/tools'

const roomInfo = reactive({
  name: '房间名',
  theme: '水果',
  playerNum: 12,
  playerLimit: 15,
  pointLimit: 120
})

// 0: 等待玩家进入 1：玩家绘画中 2：等待玩家选题 3: 公布答案并评价 4：玩家放弃出题 5：公布答案
const roomState = ref<number>(3)
const stateText = ref<string[]>([
  '等待玩家进入',
  '你的答案是？',
  '等待玩家选题',
  '等待玩家选题',
  '答案已公布',
])

interface PlayerT {
  id: number
  name: string
  avatar: FreeObjT
  point: number
  drawer: boolean
}

const playerList = reactive<PlayerT[]>([])

const getRandomPlayers = () => {
  const keys: string[] = Object.keys(avatarData)
  for (let i = 0;i < 10;i++) {
    const player: PlayerT | Object = {}
    const avatar: FreeObjT = {}
    Object.assign(player, {
      id: i,
      name: `player${i}`,
      point: 100,
      drawer: false,
    })
    keys.forEach((key: string) => {
      const list: string[] = avatarData[key]
      avatar[key] = (list[randomInteger(0, list.length)]) as string
      (player as PlayerT).avatar = avatar
    })
    playerList.push(player as PlayerT)
  }
}

getRandomPlayers()

interface Message {
  id: number
  name: string
  content: string
}

const messages = reactive<Message[]>([])
const messageList = ref<null | HTMLElement>(null)

const scrollToBottom = () => {
  nextTick(() => {
    (messageList.value as HTMLElement).scrollTop = (messageList.value as HTMLElement).scrollHeight
  })
}

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
}
const board = ref<null | boardT>(null)
const clearBoard = () => {
  (board.value as boardT).clearCanvas()
}

// 显示答案，玩家评价
const curAnswer = ref<string>('亚马逊大香蕉')
const isZan = ref<boolean>(false)
const isCai = ref<boolean>(false)
const onZan = () => {
  isZan.value = true
  isCai.value = false
}
const onCai = () => {
  isZan.value = false
  isCai.value = true
}

// 当前备选题目
const prepareQesList = reactive<ListItemT[]>([
  { value: 0, label: '芒果' },
  { value: 1, label: '苹果' },
  { value: 2, label: '梨' },
])
const curSelectQes = ref<ListItemT>(prepareQesList[0])

// 房间信息modal
const infoModalVisible = ref<boolean>(false)

// 分享房间link
const shareLink = () => {
  copyInfo(window.location.href)
}

// 退出房间
const quitModalVisible = ref<boolean>(false)
const quitRoom = () => {
  quitModalVisible.value = false
}
</script>

<style lang="scss">
.room {
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
        .board-footer {
          height: 60px;
        }
        .board-area {
          border-radius: 16px;
          overflow: hidden;
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
        }
      }
    }
    .chat-field {
      padding: 10px 5px 10px 15px;
      grid-area: c;
      .message-box {
        height: 530px;
        margin-bottom: 10px;
        position: relative;
        @extend .scroll-list-margin-fade;
        .message-list {
          height: 100%;
          overflow: auto;
          overflow-x: hidden;
          @extend .scroll-bar;
          .message {
            margin-bottom: 15px;
            &:first-child {
              margin-top: 10px;
            }
            .message-name {
              color: $main;
            }
            .message-content {
              color: $light-1;
              background-color: $main;
              padding: 6px 20px;
              border-radius: 0 8px 8px;
              font-size: 14px;
              position: relative;
              margin-top: 10px;
              &::before {
                content: "";
                display: block;
                border: 6px solid $main;
                position: absolute;
                top: -6px;
                left: -6px;
                border-top-color: transparent;
                border-left-color: transparent;
                border-bottom-color: transparent;
                transform: rotate(-45deg);
              }
            }
          }
          .slide-enter-to,
          .slide-leave-from {
            transition: all 0.3s ease;
          }
          .slide-enter-from,
          .slide-leave-to {
            opacity: 0;
            transform: translateX(10px);
          }
        }
      }
    }
    .player-field {
      height: 535px;
      grid-area: d;
      padding: 15px 5px 15px 15px;
      .player-content {
        height: 100%;
        position: relative;
        @extend .scroll-list-margin-fade;
        .player-list {
          height: 100%;
          overflow: auto;
          @extend .scroll-bar;
          .player {
            margin: 7.5px 0;
            .avatar {
              width: 50px;
              height: 53px;
            }
          }
          .player-info {
            font-size: 14px;
            padding-left: 15px;
            .player-name {
              color: $main;
            }
            .player-point {
              height: 20px;
              background-color: $main;
              font-weight: 600;
              color: $light-1;
              border-radius: 10px;
              text-align: center;
              padding: 0 10px;
              span {
                line-height: 20px;
              }
            }
          }
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