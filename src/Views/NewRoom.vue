<template>
  <div id="NewRoom" class="flex flex-clo flex-ai noselect">
    <div class="header flex">
      <div class="back flex flex-1 flex-ai text-shadow">
        <i class="icon iconfont icon-left pointer" @click="jumpToTarget('/')"></i>
        <span class="text-large">创建房间</span>
      </div>
    </div>
    <div class="room-filter flex flex-jcb">
      <div class="room-info flex flex-clo flex-jcb">
        <FlatInput v-model:value="roomInfo.name" :title="'房间名'" placeholder="请填写房间名" :maxlength="10" />
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
        <div class="other-type text-small flex flex-ai flex-jcc">其他类型尽情期待</div>
        <FlatButton class="create-btn" :disabled="!createRoomDisabled" @click="createRoom">创建房间</FlatButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useRouter, Router } from 'vue-router'
import { defineComponent, ref, Ref, reactive, computed, ComputedRef, watch } from 'vue'
import FlatInput from '/@components/FlatInput.vue'
import FlatSwitcher from '/@components/FlatSwitcher.vue'
import FlatNumberInput from '/@components/FlatNumberInput.vue'
import FlatButton from '/@components/FlatButton.vue'
import { buildSocket } from '/@utils/tools'
export default defineComponent({
  name: 'NewRoom',
  setup() {
    const router: Router = useRouter()
    const jumpToTarget: Function = (target: string): void => {
      router.replace({ path: target })
    }
    const { roomInfo, typeList } = handleRoomInfo()

    const createRoomDisabled: ComputedRef<boolean> = computed(() => {
      const { name, accessPassword, password } = roomInfo
      return (name !== '' && !accessPassword) || password !== ''
    })

    function createRoom() {
      const data = {
        content: roomInfo,
        type: 'createRoom',
      }
      buildSocket().send(data)
    }
    return {
      jumpToTarget,
      roomInfo,
      typeList,
      createRoomDisabled,
      createRoom,
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
  watch(
    () => roomInfo.accessPassword,
    (newVal) => {
      if (!newVal) roomInfo.password = ''
    }
  )
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

<style lang="scss">
@include LargeScreen {
  #NewRoom {
    #FlatInput {
      .title {
        font-size: 20px;
      }
      .input-area {
        font-size: 20px;
      }
    }
    #FlatSwitcher {
      width: 60px;
      height: 30px;
    }
    #FlatButton {
      height: 50px;
      .btn-content {
        i {
          font-size: 28px;
        }
        .content {
          font-size: 20px !important;
        }
      }
    }
  }
}
</style>
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
    height: calc(100% - 32px);
    margin-top: 30px;
    .room-info {
      width: 250px;
      .access-pwd {
        .title {
          color: $Primary;
        }
      }
      .password {
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
          color: $White;
          background-color: $Primary;
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
@include LargeScreen {
  #NewRoom {
    .header {
      .back {
        i {
          font-size: 28px;
          margin-right: 10px;
        }
        span {
          font-size: 26px;
        }
      }
    }
    .room-filter {
      margin-top: 50px;
      .room-info {
        width: 320px;
        .access-pwd {
          .title {
            font-size: 20px;
          }
        }
        .player-num {
          .title {
            font-size: 20px;
          }
        }
      }
      .room-type {
        .title {
          font-size: 20px;
        }
        .type-list {
          margin-top: 30px;
          gap: 20px;
          grid-template-columns: 200px 200px;
          .type {
            height: 50px;
            span {
              font-size: 18px !important;
            }
          }
        }
        .other-type {
          margin-top: 30px;
          font-size: 18px;
        }
        .create-btn {
          margin-top: 110px;
        }
      }
    }
  }
}
</style>
