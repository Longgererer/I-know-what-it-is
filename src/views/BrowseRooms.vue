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
          <flat-input class="search-room-name" placeholder="房间名"></flat-input>
          <flat-select class="search-room-theme" placeholder="主题" v-model="searchInfo.theme">
            <flat-list-item
              v-for="item in themeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></flat-list-item>
          </flat-select>
          <flat-button>搜索</flat-button>
        </div>
      </div>
      <div class="browse-rooms-content flex flex-col">
        <div class="rooms-table-title">
          <span>房间名</span>
          <span>人数</span>
          <span>分数</span>
          <span>主题</span>
        </div>
        <div class="table-content">
          <div class="rooms-list scroll-bar">
            <div
              class="room"
              :class="{
                'room-select': curSelect?.id === room.id
              }"
              v-for="room in roomsList"
              :key="room.id"
              @click="selectRoom(room)"
            >
              <span>
                <carousel custom-class="carousel-text" :text="room.name" center></carousel>
              </span>
              <span>{{ room.playerNum }}</span>
              <span>{{ room.point }}</span>
              <span>{{ room.theme }}</span>
              <span>
                <i class="icon iconfont icon-lock" v-if="!room.isPublic"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="browse-rooms-footer">
        <flat-button
          size="large"
          style="font-size: 16px;width: 200px"
          :disabled="curSelect === null"
          @click="enterRoom"
        >进入房间</flat-button>
      </div>
    </main>
    <flat-modal v-model="modalVisible">
      <div class="flex flex-col">
        <span>请输入房间密码：</span>
        <flat-input type="password" v-model="roomPwd" @confirm="confirmPwd"></flat-input>
      </div>
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

import { reactive, ref } from 'vue'
import { themeList } from '@utils/publicData'
import { FreeObjT } from '@/@types'

const roomsList = reactive([
  {
    id: 0,
    name: 'player的房间123123123123123',
    playerNum: '10/12',
    point: '200/360',
    theme: '动物',
    isPublic: false,
  },
  {
    id: 1,
    name: 'player的房间',
    playerNum: '10/12',
    point: '200/360',
    theme: '动物',
    isPublic: false,
  },
  {
    id: 2,
    name: 'player的房间12312312312',
    playerNum: '10/12',
    point: '200/360',
    theme: '动物',
    isPublic: true,
  },
  {
    id: 3,
    name: '这是文字跑马灯效果测试哦',
    playerNum: '10/12',
    point: '200/360',
    theme: '动物',
    isPublic: true,
  },
  {
    id: 4,
    name: 'player的房间',
    playerNum: '10/12',
    point: '200/360',
    theme: '动物',
    isPublic: true,
  },
  {
    id: 5,
    name: 'player的房间',
    playerNum: '10/12',
    point: '200/360',
    theme: '动物',
    isPublic: true,
  },
  {
    id: 6,
    name: 'player的房间',
    playerNum: '10/12',
    point: '200/360',
    theme: '动物',
    isPublic: true,
  },
  {
    id: 7,
    name: 'player的房间',
    playerNum: '10/12',
    point: '200/360',
    theme: '动物',
    isPublic: true,
  },
])

const searchInfo = reactive({
  name: '',
  theme: themeList[0],
})

const curSelect = ref<null | FreeObjT>(null)
const selectRoom = (roomInfo: FreeObjT) => {
  curSelect.value = roomInfo
}

const modalVisible = ref<boolean>(false)
const roomPwd = ref<string>('')
const enterRoom = () => {
  if (!(curSelect.value as FreeObjT).isPublic) {
    modalVisible.value = true
  } else {
    // 直接进入房间
  }
}
const confirmPwd = () => {
  // 判断密码是否正确
}
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
        .rooms-list {
          height: 280px;
          overflow: auto;
          .room {
            display: grid;
            grid-template-columns: 180px repeat(3, 150px) 1fr;
            justify-items: center;
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
      }
    }
    .browse-rooms-footer {
      text-align: right;
      margin-top: 15px;
    }
  }
}
</style>