<template>
  <div id="NewRoom" class="flex flex-clo flex-ai noselect">
    <div class="header flex">
      <div class="back flex flex-1 flex-ai text-shadow">
        <i class="icon iconfont icon-left pointer" @click="jumpToTarget('/')"></i>
        <span class="text-bold text-large">创建房间</span>
      </div>
    </div>
    <div class="room-filter flex flex-jcb">
      <div class="room-info">
        <FlatInput v-model:value="roomInfo.name" :title="'房间名'" />
        <div class="access-pwd flex flex-ai flex-jcb">
          <span class="title">设置密码</span>
          <FlatSwitcher v-model:value="roomInfo.accessPassword" />
        </div>
        <div class="password">
          <div class="screen" v-show="!roomInfo.accessPassword"></div>
          <FlatInput v-model:value="roomInfo.password" :title="'密码'" type="password" />
        </div>
        <div class="player-num flex flex-ai flex-jcb">
          <span class="title">玩家上限</span>
          <FlatNumberInput v-model:value="roomInfo.playerNum" :min="2" :max="10" />
        </div>
      </div>
      <div class="room-type flex flex-clo">
        <span class="title">题目类型</span>
        <div class="type-list">
          <div
            v-for="item in typeList"
            :key="item.id"
            class="type borbox flex flex-ai flex-jcb pointer"
            :class="roomInfo.type === item.id ? 'type-active' : ''"
            @click="roomInfo.type = item.id"
          >
            <span class="text-small">{{ item.name }}</span>
            <i class="icon iconfont icon-success" v-show="roomInfo.type === item.id"></i>
          </div>
        </div>
        <div class="other-type text-bold text-small flex flex-ai flex-jcc">其他类型尽情期待</div>
        <FlatButton class="create-btn">创建房间</FlatButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useRouter, Router } from 'vue-router'
import { defineComponent, ref, Ref, reactive } from 'vue'
import FlatInput from '/@components/FlatInput.vue'
import FlatSwitcher from '/@components/FlatSwitcher.vue'
import FlatNumberInput from '/@components/FlatNumberInput.vue'
import FlatButton from '/@components/FlatButton.vue'
export default defineComponent({
  name: 'NewRoom',
  setup() {
    const router: Router = useRouter()
    const jumpToTarget: Function = (target: string): void => {
      router.replace({ path: target })
    }
    const { roomInfo, typeList } = handleRoomInfo()
    return {
      jumpToTarget,
      roomInfo,
      typeList,
    }
  },
  components: {
    FlatInput,
    FlatSwitcher,
    FlatNumberInput,
    FlatButton,
  },
})

interface type {
  name: string
  id: number
}
interface RoomInfoHandler {
  roomInfo: RoomInfo
  typeList: type[]
}
interface RoomInfo {
  name: string
  type: number
  accessPassword: boolean
  password: string
  playerNum: number
}
function handleRoomInfo(): RoomInfoHandler {
  const roomInfo: RoomInfo = reactive({
    name: '',
    type: 0,
    accessPassword: false,
    password: '',
    playerNum: 4,
  })
  const typeList: type[] = reactive([
    { name: '综合', id: 0 },
    { name: '动物', id: 1 },
    { name: '物体', id: 2 },
    { name: '饮食', id: 3 },
  ])
  return {
    roomInfo,
    typeList,
  }
}
</script>
<style lang="scss" scope>
#NewRoom {
  width: 100%;
  height: 100%;
  .header {
    width: 100%;
    .back {
      color: $Primary;
      i {
        font-size: 24px;
        margin-right: 5px;
      }
    }
  }
  .room-filter {
    width: 100%;
    margin-top: 32px;
    .room-info {
      width: 250px;
      .access-pwd {
        margin-top: 30px;
        .title {
          color: $Primary;
        }
      }
      .password {
        margin-top: 30px;
        position: relative;
        .screen {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: $White;
          opacity: 0.5;
        }
      }
      .player-num {
        margin-top: 30px;
        .title {
          color: $Primary;
        }
      }
    }
    .room-type {
      .title {
        color: $Primary;
      }
      .type-list {
        margin-top: 15px;
        display: grid;
        gap: 15px;
        grid-template-columns: 150px 150px;
        .type {
          height: 40px;
          padding: 0 15px;
          border-radius: 5px;
          border: 2px solid $LightGray;
          color: $LightGray;
          i {
            font-size: 18px;
          }
        }
        .type-active {
          border: 2px solid $Primary;
          color: $Primary;
        }
      }
      .other-type {
        margin-top: 15px;
        height: 40px;
        color: $Primary;
      }
      .create-btn {
        margin-top: 32px;
      }
    }
  }
}
</style>
