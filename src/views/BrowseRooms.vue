<template>
  <div class="browse-rooms flex flex-jcc flex-aic">
    <main>
      <div class="browse-rooms-header flex flex-aic">
        <div class="header-back">
          <i class="icon iconfont icon-left" @click="$router.push('/')"></i>
          <span>浏览房间</span>
        </div>
        <div class="flex-1"></div>
        <div class="search-box flex">
          <flat-input class="search-room-name" placeholder="房间名" v-model="searchInfo.name"></flat-input>
          <flat-select class="search-room-theme" placeholder="主题" v-model="searchInfo.theme">
            <flat-list-item
              v-for="item in themeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></flat-list-item>
          </flat-select>
          <flat-button @click="getRoomsList">搜索</flat-button>
        </div>
      </div>
      <!-- 房间列表 -->
      <div class="browse-rooms-content flex flex-col">
        <div class="rooms-table-title">
          <span>房间名</span>
          <span>人数</span>
          <span>分数</span>
          <span>主题</span>
        </div>
        <div class="table-content">
          <div class="rooms-list scroll-bar">
            <template v-if="roomsListLoading">
              <div class="rooms-list-loader flex flex-aic flex-jcc">
                <loader size="small"></loader>
              </div>
            </template>
            <template v-else-if="!roomsListLoading && roomsList.length === 0">
              <div class="rooms-list-empty flex flex-aic flex-jcc">
                <span>暂时没有房间可以加入哦，</span>
                <span class="to-create-room" @click="$router.push('/create')">去创建</span>
              </div>
            </template>
            <template v-else-if="roomsList.length > 0">
              <div
                class="room"
                :class="{
                  'room-select': curSelect?.roomId === room.roomId
                }"
                v-for="room in roomsList"
                :key="room.roomId"
                @click="selectRoom(room)"
              >
                <span>
                  <carousel custom-class="carousel-text" :text="room.roomName" center></carousel>
                </span>
                <span>{{ room.num }}/{{ room.max }}</span>
                <span>{{ room.accumulate }}</span>
                <span>{{ themeList[room.tid].label }}</span>
                <span>
                  <i class="icon iconfont icon-lock" v-if="room.encrypted"></i>
                </span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="browse-rooms-footer">
        <flat-button
          size="large"
          style="font-size: 16px;width: 200px"
          :disabled="curSelect === null"
          @click="beforeEnterRoom"
        >进入房间</flat-button>
      </div>
    </main>
    <flat-modal v-model="modalVisible" @confirm="confirmPwd" :close-on-click-screen="false">
      <div class="flex flex-col">
        <span>请输入房间密码：</span>
        <flat-input type="password" v-model="roomPwd"></flat-input>
      </div>
    </flat-modal>
    <screen-loader
      v-model="enterLoaderVisible"
      slot-class="enter-loader-content"
      :close-by-click="false"
    >
      <span>正在进入房间...</span>
    </screen-loader>
    <flat-modal
      v-model="warningModalVisible"
      title="警告"
      :close-on-click-screen="false"
      @confirm="warningModalVisible = false"
    >
      <span>{{ warningText }}</span>
    </flat-modal>
  </div>
</template>

<script setup lang="ts">
import FlatInput from '@components/FlatInput.vue'
import FlatSelect from '@components/FlatSelect.vue'
import FlatListItem from '@components/FlatListItem.vue'
import FlatButton from '@components/FlatButton.vue'
import FlatModal from '@components/FlatModal.vue'
import Carousel from '@components/Carousel.vue'
import ScreenLoader from '@components/ScreenLoader.vue'
import Loader from '@components/Loader.vue'

import { reactive, ref, inject, onBeforeUnmount, ComponentInternalInstance, getCurrentInstance } from 'vue'
import { themeList } from '@utils/publicData'
import { stateName } from '@/store'
import { FreeObjT, RoomT, GlobalStateT } from '@/@types'
import router from '@/router'

const vm: ComponentInternalInstance | null = getCurrentInstance()
const ws = vm!.appContext.config.globalProperties.$ws

const globalState = <GlobalStateT>inject(stateName)

// 房间列表
const roomsList = ref<RoomT[]>([])
const roomsListLoading = ref<boolean>(false)

// 查询房间
const searchInfo = reactive({
  name: '',
  theme: themeList[0],
})

// 获取房间列表
const getRoomsList = () => {
  roomsListLoading.value = true
  ws.send({
    type: 'roomsList',
    data: {
      roomName: searchInfo.name,
      tid: searchInfo.theme.value
    }
  })
}
getRoomsList()

// 定时获取房间列表
const getRoomsListTimer = setInterval(() => {
  ws.send({
    type: 'roomsList',
    data: {
      roomName: searchInfo.name,
      tid: searchInfo.theme.value
    }
  })
}, 10000)

ws.subscribeEvent('roomsList', (resp: FreeObjT) => {
  roomsListLoading.value = false
  roomsList.value = resp.data
})

// 选择房间
const curSelect = ref<null | RoomT>(null)
const selectRoom = (roomInfo: RoomT) => {
  curSelect.value = roomInfo
}

// 输入房间密码弹框
const modalVisible = ref<boolean>(false)
const roomPwd = ref<string>('')

// 进入房间
const warningModalVisible = ref<boolean>(false)
const enterLoaderVisible = ref<boolean>(false)
const warningText = ref<string>('')
const enterRoom = () => {
  enterLoaderVisible.value = true
  const userId = globalState.userId
  const msg = {
    type: 'enterRoom',
    roomId: curSelect.value?.roomId,
    send: userId
  }
  // 如果此时用户还没注册，注册用户
  if (userId === 0) {
    Object.assign(msg, {
      image: globalState.avatar,
      name: globalState.username
    })
  }
  ws.send(msg)
  const callback = (resp: FreeObjT) => {
    const { data, send, roomId, drawer, bol } = resp
    globalState.userId = send
    ws.unsubscribeEvent('enterRoom', callback)
    enterLoaderVisible.value = false
    if (bol === false) {
      warningModalVisible.value = true
      warningText.value = '房间人满，无法进入！'
      return void 0
    }
    router.push({
      name: 'Room',
      params: {
        roomId,
        drawer,
        players: JSON.stringify(data),
        roomInfo: JSON.stringify(curSelect.value)
      }
    })
  }
  ws.subscribeEvent('enterRoom', callback)
}

// 进入房间之前的处理
const beforeEnterRoom = () => {
  if ((curSelect.value as RoomT).encrypted) {
    modalVisible.value = true
  } else {
    // 直接进入房间
    enterRoom()
  }
}

const confirmPwd = () => {
  if (!roomPwd.value.trim()) {
    return void 0
  }
  ws.send({
    type: 'verifyPwd',
    data: roomPwd.value.trim(),
    roomId: curSelect.value?.roomId
  })
  // 判断密码是否正确
  const callback = (resp: FreeObjT) => {
    if (resp.bol) {
      // 密码正确，进入房间
      enterRoom()
    } else {
      // 密码错误
      warningModalVisible.value = true
      warningText.value = '密码错误！'
    }
    ws.unsubscribeEvent('verifyPwd', callback)
  }
  ws.subscribeEvent('verifyPwd', callback)
}

onBeforeUnmount(() => {
  ws.unsubscribeAll()
  clearInterval(getRoomsListTimer)
})
</script>

<style lang="scss">
.browse-rooms {
  width: 100%;
  height: 100%;
  main {
    width: 850px;
    height: 500px;
    padding: 40px;
    background-color: $light-1;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    .browse-rooms-header {
      .header-back {
        color: $main;
        font-size: 24px;
        font-weight: 600;
        i {
          font-size: inherit;
          margin-right: 15px;
          cursor: pointer;
          opacity: 0.5;
          transition: opacity 0.3s ease;
          &:hover {
            opacity: 1;
          }
        }
      }
      .search-box {
        .search-room-name {
          width: 200px;
          margin-right: 25px;
        }
        .search-room-theme {
          width: 100px;
          margin-right: 25px;
        }
      }
    }
    .browse-rooms-content {
      margin-top: 25px;
      .rooms-table-title {
        display: grid;
        grid-template-columns: 180px repeat(3, 150px);
        justify-items: center;
        color: $main;
        font-size: 16px;
        padding-left: 20px;
      }
      .table-content {
        margin-top: 10px;
        position: relative;
        @extend .scroll-list-margin-fade;
        & > .rooms-list {
          height: 280px;
          overflow: auto;
          & > .room {
            display: grid;
            grid-template-columns: 180px repeat(3, 150px) 1fr;
            justify-items: center;
            align-items: center;
            border: 2px solid $light-3;
            border-radius: 4px;
            padding: 10px 0 10px 20px;
            margin-bottom: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            &:hover {
              color: $main;
              border-color: $main;
            }
            &:first-child {
              margin-top: 5px;
            }
            i {
              color: $main;
              font-size: 20px;
            }
            .carousel-text {
              width: 180px;
            }
          }
          .room-select {
            background-color: $main !important;
            color: $light-1 !important;
            border-color: $main !important;
            i {
              color: $light-1 !important;
            }
          }
        }
        .rooms-list-loader {
          height: 100%;
        }
        .rooms-list-empty {
          height: 100%;
          color: $main;
          .to-create-room {
            color: $blue;
            cursor: pointer;
          }
        }
      }
    }
    .browse-rooms-footer {
      text-align: right;
      margin-top: 15px;
    }
  }
}
.enter-loader-content {
  color: $main;
  font-size: 20px;
  margin-top: 20px;
}
</style>