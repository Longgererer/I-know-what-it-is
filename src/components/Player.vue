<template>
  <div class="player flex">
    <div class="avatar">
      <avatar :avatar="player.avatar"></avatar>
    </div>
    <div class="player-info flex flex-col flex-jcb flex-1 flex-ais">
      <i class="icon iconfont icon-pen" v-show="player.drawer"></i>
      <div class="player-name">
        <span>
          <carousel custom-class="carousel-text" :text="player.name" font-weight="bold"></carousel>
        </span>
      </div>
      <div class="player-point">
        <span>{{ player.point }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Carousel from '@components/Carousel.vue'
import Avatar from '@components/Avatar.vue'

import { PlayerT } from '@/@types'

interface Props {
  player: PlayerT
}

const props = withDefaults(defineProps<Props>(), {

})
</script>

<style lang="scss">
.player {
  margin: 7.5px 0;
  .avatar {
    width: 50px;
    height: 53px;
  }
  .player-info {
    font-size: 14px;
    padding-left: 10px;
    position: relative;
    .icon-pen {
      position: absolute;
      color: $light-3;
      font-size: 52px;
      right: 10px;
    }
    .player-name {
      color: $main;
      .carousel-text {
        width: 94px;
      }
    }
    .player-point {
      height: 20px;
      background-color: $main;
      font-weight: 600;
      color: $light-1;
      border-radius: 10px;
      text-align: center;
      padding: 0 10px;
      position: relative;
      span {
        line-height: 20px;
      }
    }
  }
}
</style>