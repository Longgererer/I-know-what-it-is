<template>
  <div id="SeekRoom" class="noselect">
    <FlatModal :showTitle="false" :visible="showPwdModal">
      <div class="password-modal flex flex-clo">
        <span class="text-small">请输入房间密码：</span>
        <FlatInput v-model:value="roomPassword" size="small" type="password" />
        <div class="btn-opt flex flex-jend">
          <FlatButton size="small" type="cancel" @click="modalCallback.cancel()">取消</FlatButton>
          <FlatButton size="small" :loading="showEnterLoading" :disabled="!roomPassword" @click="modalCallback.confirm()"
            >验证</FlatButton
          >
        </div>
      </div>
    </FlatModal>
    <div class="header flex">
      <div class="back flex flex-1 flex-ai text-shadow">
        <i class="icon iconfont icon-left pointer" @click="jumpToTarget('/')"></i>
        <span class="text-bold text-large">查看房间</span>
      </div>
      <div class="filter flex">
        <div class="room-name">
          <FlatInput
            :placeholder="'房间名'"
            :size="'small'"
            v-model:value="searchOpt.name"
            :lazy="true"
            :delay="1000"
          />
        </div>
        <div class="room-type">
          <FlatSelect
            :placeholder="'类型'"
            :size="'small'"
            :data="roomTypeList"
            v-model:currentItem="currentItem"
            @change="selectItem"
          />
        </div>
      </div>
    </div>
    <div class="result-box">
      <FlatLoader :text="'加载房间中'" v-show="isListLoading" />
      <div class="result-head text-small borbox">
        <span>房间名</span>
        <span>人数</span>
        <span>类型</span>
      </div>
      <div class="result-list">
        <div
          class="room text-small borbox pointer noselect"
          v-for="item in roomInfoList"
          :key="item.id"
          :class="currentSelectedRoom.id === item.id && 'room-active'"
          @click="selectRoom(item)"
        >
          <span>{{ item.name }}</span>
          <span>{{ item.playerNum }} / {{ item.maxNum }}</span>
          <span>{{ roomTypeList[item.type].value }}</span>
          <i v-if="item.accessPassword" class="icon iconfont icon-lock"></i>
        </div>
      </div>
    </div>
    <div class="btn-opt flex flex-jend">
      <div class="enter-btn">
        <FlatButton :disabled="currentSelectedRoom.id === undefined" @click="beforeEnterRoom">进入房间</FlatButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useRouter, Router } from 'vue-router'
import { defineComponent, reactive, ref, Ref, watch, onMounted } from 'vue'
import { RoomType, roomTypeList } from '/@utils/publicData'
import { removeAllObjProperties } from '/@utils/tools'
import FlatInput from '/@components/FlatInput.vue'
import FlatSelect from '/@components/FlatSelect.vue'
import FlatButton from '/@components/FlatButton.vue'
import FlatLoader from '/@components/FlatLoader.vue'
import FlatModal from '/@components/FlatModal.vue'
export default defineComponent({
  name: 'SeekRoom',
  setup() {
    const router: Router = useRouter()
    const jumpToTarget = (target: string): void => {
      router.replace({ path: target })
    }
    const { currentItem, selectItem, searchOpt } = handleSearchOpt()
    const { roomInfoList, isListLoading, loadRoomList } = handleRoomInfoList()
    const {
      currentSelectedRoom,
      showEnterLoading,
      showPwdModal,
      roomPassword,
      modalCallback,
      beforeEnterRoom,
      selectRoom,
    } = handleEnterRoom()

    onMounted(() => {
      loadRoomList(searchOpt)
    })

    // 监听表单内容searchOpt的变化，查询房间列表
    watch(
      searchOpt,
      (newOpt) => {
        removeAllObjProperties(currentSelectedRoom)
        loadRoomList(newOpt)
      },
      { deep: true }
    )
    return {
      roomTypeList,
      jumpToTarget,
      currentItem,
      selectItem,
      roomInfoList,
      isListLoading,
      searchOpt,
      showPwdModal,
      roomPassword,
      currentSelectedRoom,
      modalCallback,
      beforeEnterRoom,
      selectRoom,
      showEnterLoading,
    }
  },
  components: {
    FlatInput,
    FlatSelect,
    FlatButton,
    FlatLoader,
    FlatModal,
  },
})

interface RoomSearchOpt {
  name: string
  type: number
}
// 处理房间查询表单
function handleSearchOpt() {
  const currentItem: RoomType = reactive({ ...roomTypeList[0] })
  const searchOpt: RoomSearchOpt = reactive({
    name: '',
    type: currentItem.id,
  })
  // 监听类型选择框改变的回调
  const selectItem: Function = (item: RoomType): void => {
    searchOpt.type = item.id
    Object.assign(currentItem, item)
  }
  return {
    currentItem,
    selectItem,
    searchOpt,
  }
}
// 处理房间列表信息
interface RoomInfo {
  id: number
  name: string
  playerNum: number
  maxNum: number
  type: number
  accessPassword: boolean
}
function handleRoomInfoList() {
  const isListLoading: Ref<boolean> = ref(false)
  const roomInfoList: RoomInfo[] = reactive([])
  const loadRoomList = (options: RoomSearchOpt): void => {
    // 模糊查询房间列表
    isListLoading.value = true
    setTimeout(() => {
      roomInfoList.splice(
        0,
        roomInfoList.length,
        ...[
          { id: 0, name: '房间1', playerNum: 10, maxNum: 15, type: 0, accessPassword: true },
          { id: 1, name: '房间2', playerNum: 10, maxNum: 15, type: 1, accessPassword: true },
          { id: 2, name: '房间3', playerNum: 10, maxNum: 15, type: 2, accessPassword: false },
          { id: 3, name: '房间3', playerNum: 10, maxNum: 15, type: 2, accessPassword: false },
          { id: 4, name: '房间3', playerNum: 10, maxNum: 15, type: 2, accessPassword: false },
          { id: 5, name: '房间3', playerNum: 10, maxNum: 15, type: 2, accessPassword: false },
          { id: 6, name: '房间3', playerNum: 10, maxNum: 15, type: 2, accessPassword: false },
          { id: 7, name: '房间3', playerNum: 10, maxNum: 15, type: 2, accessPassword: false },
          { id: 8, name: '房间3', playerNum: 10, maxNum: 15, type: 2, accessPassword: false },
        ]
      )
      isListLoading.value = false
    }, 2000)
  }
  return {
    isListLoading,
    roomInfoList,
    loadRoomList,
  }
}
// 进入房间
function handleEnterRoom() {
  interface ModalCallback {
    confirm: () => void
    cancel: () => void
  }
  const currentSelectedRoom: RoomInfo | {} = reactive({})
  const showPwdModal: Ref<boolean> = ref(false)
  const showEnterLoading: Ref<boolean> = ref(false)
  const roomPassword: Ref<string> = ref('')
  const selectRoom = (room: RoomInfo): void => {
    Object.assign(currentSelectedRoom, room)
  }
  const beforeEnterRoom = (): void => {
    if ((currentSelectedRoom as RoomInfo).accessPassword) showPwdModal.value = true
  }
  const enterRoom = (): void => {
    showEnterLoading.value = true
    // 进入房间
    setTimeout(() => {
      showPwdModal.value = false
      roomPassword.value = ''
      showEnterLoading.value = false
    }, 3000)
  }
  const modalCallback: ModalCallback = {
    confirm: () => {
      enterRoom()
    },
    cancel: () => {
      showPwdModal.value = false
      roomPassword.value = ''
    },
  }
  return {
    currentSelectedRoom,
    showPwdModal,
    roomPassword,
    modalCallback,
    beforeEnterRoom,
    selectRoom,
    showEnterLoading,
  }
}
</script>
<style lang="scss">
#FlatModal {
  .password-modal {
    color: $Primary;
    .btn-opt {
      margin-top: 15px;
      #FlatButton {
        width: 100px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
#SeekRoom {
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
    .filter {
      .room-name {
        width: 150px;
        margin-right: 20px;
      }
      .room-type {
        width: 80px;
      }
    }
  }
  .result-box {
    margin-top: 30px;
    position: relative;
    .result-head {
      display: grid;
      grid-template-columns: 130px 130px 260px auto;
      color: $Primary;
      padding: 0 20px;
    }
    .result-list {
      margin-top: 10px;
      height: 220px;
      overflow-y: auto;
      .room {
        height: 40px;
        padding: 0 20px;
        border: 2px solid $ShallowWhite;
        border-radius: 5px;
        display: grid;
        grid-template-columns: 130px 130px 260px auto;
        align-items: center;
        @include Transition(all, 0.3s, ease);
        i {
          font-size: 20px;
          color: $Gray;
        }
        &:not(:first-child) {
          margin-top: 5px;
        }
        &:hover {
          color: $Primary;
        }
      }
      .room-active {
        color: $Primary;
        border: 2px solid $Primary;
      }
    }
  }
  .btn-opt {
    margin-top: 30px;
    .enter-btn {
      width: 250px;
    }
  }
}
</style>
