<template>
  <div class="home flex flex-jcc flex-aic">
    <main>
      <div class="logo">
        <img src="../assets/images/logo.svg" />
      </div>
      <div class="home-content flex">
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
            <flat-input placeholder="player" show-limit :maxlength="20"></flat-input>
          </div>
        </div>
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
  <screen-loader v-model="loaderVisible" slot-class="home-loader-content">
    <span>正在寻找游戏</span>
  </screen-loader>
</template>

<script setup lang="ts">
import { ref, reactive, ComponentInternalInstance, getCurrentInstance } from 'vue'
import FlatButton from '@components/FlatButton.vue'
import FlatInput from '@components/FlatInput.vue'
import Avatar from '@components/Avatar.vue'
import ScreenLoader from '@components/ScreenLoader.vue'

import { avatarData } from '@utils/publicData'
import { randomInteger } from '@utils/tools'
import { FreeObjT } from '@/@types'

const vm: ComponentInternalInstance | null = getCurrentInstance()
const ws = vm!.appContext.config.globalProperties.$ws

// 随机头像
const avatar = reactive<FreeObjT>({})

const getRandomAvatar = () => {
  const keys: string[] = Object.keys(avatarData)
  keys.forEach((key: string) => {
    const list: string[] = avatarData[key]
    avatar[key] = list[randomInteger(0, list.length)]
  })
}
getRandomAvatar()

// 当前正在游玩的玩家数
const playerNum = ref<number>(0)

// 快速开始
const loaderVisible = ref<boolean>(false)

const quickStart = () => {
  loaderVisible.value = true
}
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