<template>
  <div id="HomeMenu" class="flex flex-clo flex-ai">
    <div class="logo">
      <img src="../assets/logo.svg" alt="" />
    </div>
    <div class="home-content flex flex-jcb">
      <div class="profile flex flex-clo flex-ai">
        <div class="img-box">
          <img :src="avatarUrl" class="circle" alt="" />
          <div class="refresh pointer circle flex flex-ai flex-jcc" @click="refreshUrl">
            <i class="icon iconfont icon-refresh text-shadow"></i>
          </div>
        </div>
        <FlatInput :title="'你的昵称'" v-model:value="nickname" />
      </div>
      <div class="room-options flex flex-clo flex-jcb">
        <FlatButton class="flat-button" :showIcon="true" :icon="'icon-new'" @click="jumpToTarget('/create')"
          >新建房间</FlatButton
        >
        <FlatButton class="flat-button" :showIcon="true" :icon="'icon-room'" @click="jumpToTarget('/seek')"
          >查看房间</FlatButton
        >
        <FlatButton class="flat-button" :showIcon="true" :icon="'icon-quick'">快速开始</FlatButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { useRouter, Router } from 'vue-router'
import AvatarGenerator from '/@utils/avatarGenerator'
import FlatInput from '/@components/FlatInput.vue'
import FlatButton from '/@components/FlatButton.vue'
export default defineComponent({
  name: 'Home',
  setup() {
    const router: Router = useRouter()
    const jumpToTarget: Function = (target: string): void => {
      router.replace({ path: target })
    }
    const { avatarUrl, refreshUrl } = handleAvatarUrl()
    const { nickname } = handleNickname()
    return { jumpToTarget, avatarUrl, refreshUrl, nickname }
  },
  components: {
    FlatInput,
    FlatButton,
  },
})

function handleNickname(): { nickname: Ref<string> } {
  const nickname: Ref = ref<string>('')
  return {
    nickname,
  }
}

interface AvatarInfo {
  avatarUrl: Ref<string>
  refreshUrl: Function
}
function handleAvatarUrl(): AvatarInfo {
  const ag: any = new AvatarGenerator()
  const avatarUrl: Ref = ref<string>(ag.getAvatarSVGUrl())
  return {
    avatarUrl,
    refreshUrl: (): void => {
      avatarUrl.value = ag.createAvatarId().getAvatarSVGUrl()
    },
  }
}
</script>

<style lang="scss">
@include LargeScreen {
  #HomeMenu {
    .home-content {
      #FlatInput {
        .title {
          font-size: 18px;
        }
        .input-area {
          font-size: 18px;
        }
      }
      #FlatButton {
        height: 50px;
        .btn-content {
          i{
            font-size: 28px;
          }
          .content {
            font-size: 20px !important;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
#HomeMenu {
  width: 100%;
  height: 100%;
  .logo {
    margin-bottom: 60px;
    img {
      width: 250px;
    }
  }
  .home-content {
    width: 100%;
    .profile {
      width: 250px;
      .img-box {
        width: 120px;
        height: 120px;
        position: relative;
        z-index: 1;
        margin-bottom: 35px;
        img {
          width: 100%;
          height: 100%;
        }
        .refresh {
          width: 30px;
          height: 30px;
          background-color: $Primary;
          color: $White;
          position: absolute;
          z-index: 10;
          right: 0;
          bottom: 0;
          i {
            font-size: 24px;
          }
        }
      }
    }
    .room-options {
      width: 250px;
    }
  }
}
@include LargeScreen {
  #HomeMenu {
    .logo {
      margin-bottom: 100px;
      img {
        width: 350px;
      }
    }
    .home-content {
      .profile {
        width: 350px;
        .img-box {
          width: 180px;
          height: 180px;
          .refresh {
            width: 50px;
            height: 50px;
            i {
              font-size: 32px;
            }
          }
        }
      }
      .room-options {
        width: 350px;
      }
    }
  }
}
</style>
