<template>
  <div class="home flex flex-jcc flex-aic">
    <main>
      <div class="logo">
        <img src="../assets/images/logo.svg" />
      </div>
      <div class="version">v{{projectConfig.version}}</div>
      <div class="home-content flex">
        <!-- 用户信息：头像、用户名 -->
        <div class="user-info-content flex flex-col flex-1 flex-aic">
          <div class="avatar">
            <avatar :avatar="avatar"></avatar>
            <flat-button
              class="random-btn"
              size="large"
              icon
              icon-class="icon iconfont icon-refresh"
              @click="getRandomAvatar"
            ></flat-button>
          </div>
          <div class="username">
            <span class="username-label">昵称</span>
            <flat-input :placeholder="placeholder" show-limit :maxlength="20" v-model="username"></flat-input>
          </div>
        </div>
        <!-- 左侧菜单：快速开始、新建房间、浏览房间 -->
        <div class="side-menu flex-1 flex flex-col">
          <div class="btn-group flex flex-col flex-jcb">
            <flat-button
              class="btn"
              size="xLarge"
              show-icon
              icon-class="icon iconfont icon-quick"
              @click="quickStart"
            >快速开始</flat-button>
            <flat-button
              class="btn"
              size="xLarge"
              show-icon
              icon-class="icon iconfont icon-new"
              @click="$router.push('/create')"
            >新建房间</flat-button>
            <flat-button
              class="btn"
              size="xLarge"
              show-icon
              icon-class="icon iconfont icon-liulan"
              @click="$router.push('/browse')"
            >浏览房间</flat-button>
          </div>
          <div class="player-num">
            <span>{{ playerNum }} 名玩家正在游玩中</span>
          </div>
        </div>
      </div>
    </main>
  </div>
  <screen-loader v-model="loaderVisible" slot-class="home-loader-content" :close-by-click="false">
    <span>正在寻找游戏...</span>
  </screen-loader>
  <!-- 找不到快速开始的房间 -->
  <flat-modal
    title="提示"
    v-model="fitRoomModalVisible"
    :show-close="false"
    :close-on-click-screen="false"
    @confirm="fitRoomModalVisible = false"
  >
    <span>抱歉！没有找到合适的房间:(</span>
  </flat-modal>
</template>

<script setup lang="ts">
import FlatButton from '@components/FlatButton.vue'
import FlatInput from '@components/FlatInput.vue'
import FlatModal from '@components/FlatModal.vue'
import Avatar from '@components/Avatar.vue'
import ScreenLoader from '@components/ScreenLoader.vue'

import { ref, inject, onBeforeUnmount, ComponentInternalInstance, getCurrentInstance } from 'vue'
import router from '@/router'
import { onBeforeRouteLeave } from 'vue-router'
import { avatarData, avatarDataOrderList } from '@utils/publicData'
import { randomInteger } from '@utils/tools'
import { local } from '@utils/storage'
import { stateName } from '@/store'
import { FreeObjT, GlobalStateT } from '@/@types'
import projectConfig from '../../package.json'

const vm: ComponentInternalInstance | null = getCurrentInstance()
const ws = vm!.appContext.config.globalProperties.$ws

const globalState = <GlobalStateT>inject(stateName)

// 用户名
const username = ref<string>(globalState.username)
const placeholder = `Player#${randomInteger(0, 10000)}`

// 随机头像
const avatar = ref<string>(globalState.avatar)
const getRandomAvatar = () => {
  const res: number[] = []
  avatarDataOrderList.forEach((key: string, index) => {
    const len = avatarData[key].length
    res[index] = randomInteger(0, len - 1)
  })
  avatar.value = res.join(',')
}
if (globalState.avatar === '') {
  getRandomAvatar()
}

// 当前正在游玩的玩家数
const playerNum = ref<number>(0)

const getOnlineNum = () => {
  ws.send({ type: 'onlineNum' })
}
getOnlineNum()

// 每隔10s获取一次在线人数
const getPlayerNumTimer = setInterval(() => {
  getOnlineNum()
}, 10000)

ws.subscribeEvent('onlineNum', (resp: FreeObjT) => {
  playerNum.value = resp.data
})

// 快速开始
const loaderVisible = ref<boolean>(false)
const fitRoomModalVisible = ref<boolean>(false)

const quickStart = () => {
  const name = username.value.trim() || placeholder
  ws.send({
    type: 'quickStart',
    name,
    image: avatar.value,
    send: globalState.userId
  })
  loaderVisible.value = true

  globalState.username = name
  globalState.avatar = avatar.value
}

ws.subscribeEvent('quickStart', (resp: FreeObjT) => {
  loaderVisible.value = false
  const { data, send, roomId, drawer } = resp
  // 设置userId
  globalState.userId = send
  if (roomId === -1) {
    // 没找到房间 弹出提示
    fitRoomModalVisible.value = true
  } else {
    // 找到房间，跳转到roomId对应的页面
    const [roomInfo, players] = data
    console.log(roomId, drawer, players, roomInfo)
    router.push({
      name: 'Room',
      params: {
        roomId,
        drawer,
        players: JSON.stringify(players),
        roomInfo: JSON.stringify(roomInfo)
      }
    })
  }
})

onBeforeRouteLeave(() => {
  // 路由切换前存储用户信息
  const name = username.value.trim() || placeholder
  globalState.username = name
  globalState.avatar = avatar.value
  local.set('username', name)
  local.set('avatar', avatar.value)
  clearInterval(getPlayerNumTimer)
})

onBeforeUnmount(() => {
  ws.unsubscribeAll()
})
</script>

<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  main {
    width: 850px;
    height: 500px;
    padding: 40px;
    background-color: $light-1;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    .logo {
      text-align: center;
      img {
        width: 300px;
      }
    }
    .version {
      text-align: center;
      color: $light-4;
    }
    .home-content {
      padding-top: 40px;
      .user-info-content {
        .avatar {
          width: 150px;
          position: relative;
          .random-btn {
            position: absolute;
            bottom: 3px;
            right: 0;
          }
        }
        .username {
          margin-top: 35px;
          width: 100%;
          .username-label {
            display: inline-block;
            color: $main;
            font-size: 20px;
            margin-bottom: 10px;
          }
        }
      }
      .side-menu {
        padding: 0 50px;
        position: relative;
        .btn-group {
          .btn {
            font-family: $font;
            margin-bottom: 30px;
          }
        }
        .player-num {
          color: $main;
          position: absolute;
          right: 50px;
          bottom: 0;
        }
      }
    }
  }
}
.home-loader-content {
  color: $main;
  font-size: 20px;
  margin-top: 20px;
}
</style>