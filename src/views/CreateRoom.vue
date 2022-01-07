<template>
  <div class="create-room flex flex-jcc flex-aic">
    <main>
      <div class="create-room-header flex flex-aic">
        <i class="icon iconfont icon-left" @click="$router.push('/')"></i>
        <span>新建房间</span>
      </div>
      <div class="create-room-content flex">
        <div class="room-info-left flex-1">
          <div class="room-name flex flex-col">
            <span class="room-name-label">房间名</span>
            <flat-input placeholder="player的房间" show-limit :maxlength="20" v-model.trim="roomName"></flat-input>
          </div>
          <div class="public flex flex-aic flex-jcb">
            <span class="public-label">是否公开</span>
            <flat-switcher v-model="isPublic" @change="onPublicChanged"></flat-switcher>
          </div>
          <div class="room-password flex flex-col" :class="{ 'room-password-disabled': isPublic }">
            <span class="room-password-label">密码</span>
            <flat-input
              type="password"
              show-limit
              :maxlength="20"
              :disabled="isPublic"
              v-model="password"
            ></flat-input>
          </div>
          <div class="player-limit flex flex-aic flex-jcb">
            <span class="player-limit-label">玩家上限(2~15)</span>
            <flat-number-input :max="15" :min="2" v-model="playerLimit"></flat-number-input>
          </div>
          <div class="point-limit flex flex-aic flex-jcb">
            <span class="point-limit-label">积分上限</span>
            <div class="point-limit-select">
              <flat-select v-model="pointLimit"></flat-select>
            </div>
          </div>
        </div>
        <div class="room-info-right flex-1 flex flex-col">
          <div class="theme-title">主题</div>
          <div class="themes-list flex-1">
            <theme
              v-for="item in themeList"
              :key="item.value"
              :selected="theme.value === item.value"
              :text="item.label"
              @click="selectTheme(item)"
            ></theme>
            <span class="expect">其他类型尽情期待</span>
          </div>
          <flat-button size="xLarge" style="font-size: 16px" shadow @click="createRoom">创建房间</flat-button>
        </div>
      </div>
    </main>
    <flat-modal
      :show-close="false"
      v-model="warningModalVisible"
      title="警告"
      :closeOnClickScreen="false"
      @confirm="warningModalVisible = false"
    >
      <span>{{ warningText }}</span>
    </flat-modal>
  </div>
</template>

<script setup lang="ts">
import FlatInput from '@components/FlatInput.vue'
import FlatSwitcher from '@components/FlatSwitcher.vue'
import FlatNumberInput from '@components/FlatNumberInput.vue'
import FlatSelect from '@components/FlatSelect.vue'
import FlatButton from '@components/FlatButton.vue'
import FlatModal from '@components/FlatModal.vue'
import Theme from '@components/Theme.vue'

import { ref } from 'vue'
import { themeList } from '@utils/publicData'
import { ListItemT } from '@/@types'

const roomName = ref<string>('')
const isPublic = ref<boolean>(true)
const password = ref<string>('')
const playerLimit = ref<number>(2)
const pointLimit = ref<number>(100)
const theme = ref<ListItemT>(themeList[0])

const onPublicChanged = (newState: boolean) => {
  if (newState) {
    password.value = ''
  }
}

const selectTheme = (item: ListItemT) => {
  theme.value = item
}

const warningModalVisible = ref<boolean>(false)
const warningText = ref<string>('')

const createRoom = () => {
  if (roomName.value === '') {
    warningText.value = '请填写房间名！'
    warningModalVisible.value = true
  } else if (!isPublic.value && password.value === '') {
    warningText.value = '请填写密码！'
    warningModalVisible.value = true
  } else {
    // 进入房间
  }
}
</script>

<style lang="scss">
.create-room {
  width: 100%;
  height: 100%;
  main {
    width: 850px;
    height: 500px;
    padding: 40px;
    background-color: $light-1;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    .create-room-header {
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
    .create-room-content {
      margin-top: 30px;
      .room-info-left {
        padding-right: 20px;
        .room-name {
          .room-name-label {
            display: inline-block;
            color: $main;
            font-size: 20px;
            margin-bottom: 5px;
          }
        }
        .public {
          margin: 15px 0;
          .public-label {
            font-size: 20px;
            color: $main;
          }
        }
        .room-password {
          @extend .room-name;
          .room-password-label {
            @extend .room-name-label;
          }
        }
        .room-password-disabled {
          opacity: 0.5;
        }
        .player-limit {
          @extend .public;
          .player-limit-label {
            @extend .public-label;
          }
        }
        .point-limit {
          @extend .public;
          .point-limit-label {
            @extend .public-label;
          }
          .point-limit-select {
            width: 100px;
          }
        }
      }
      .room-info-right {
        padding-left: 20px;
        .theme-title {
          font-size: 20px;
          color: $main;
        }
        .themes-list {
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(3, min-content);
          gap: 10px;
          position: relative;
          .theme {
            color: $light-4;
            background-color: $light-1;
            font-size: 16px;
            border: 2px solid $light-3;
            border-radius: 8px;
            padding: 8px 0;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            i {
              position: absolute;
              right: 15px;
              transform: translateY(-50%);
              top: 50%;
              opacity: 0;
            }
            &:hover {
              border-color: $main;
              color: $main;
            }
          }
          .theme-active {
            background-color: $main !important;
            border-color: $main !important;
            color: $light-1 !important;
            box-shadow: $box-shadow;
            i {
              opacity: 1 !important;
            }
          }
          .expect {
            position: absolute;
            bottom: 10px;
            right: 0;
            color: $main;
          }
        }
      }
    }
  }
}
</style>