<template>
  <div class="player flex" :class="{ 'player-own': own }">
    <div class="avatar">
      <avatar :avatar="player.image"></avatar>
    </div>
    <div class="player-info flex flex-col flex-jcb flex-1 flex-ais">
      <i class="icon iconfont icon-pen" v-show="drawer === player.uid"></i>
      <div class="player-name">
        <span>
          <carousel custom-class="carousel-text" :text="player.userName" font-weight="bold"></carousel>
        </span>
      </div>
      <div class="player-point">
        <span>{{ player.point }}</span>
        <div class="point-gaps">
          <span
            v-for="(item, index) in pointGaps"
            :key="index"
            class="point-gap"
          >{{ item > 0 ? `+${item}` : item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Carousel from '@components/Carousel.vue'
import Avatar from '@components/Avatar.vue'

import { ref, reactive, inject, watch } from 'vue'
import { stateName } from '@/store'
import { PlayerT, GlobalStateT } from '@/@types'

const globalState = <GlobalStateT>inject(stateName)

interface Props {
  player: PlayerT,
  drawer: number
}

const props = withDefaults(defineProps<Props>(), {})

const pointGaps = reactive<number[]>([])
// 玩家分数变化，计算出差值，然后开始加/减分动画
watch(() => props.player.point, (newPoint, oldPoint) => {
  pointGaps.push(newPoint - oldPoint)
  setTimeout(() => {
    pointGaps.splice(0, 1)
  }, 1000)
})

const own = ref<boolean>(false)
if (globalState.userId === props.player.uid) {
  own.value = true
}
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
      .point-gap {
        position: absolute;
        color: $green;
        top: 0;
        left: 10px;
        text-shadow: 0 0 5px $green;
        font-weight: 600;
        animation: pointFade ease-out 1s 1 forwards;
      }
      @keyframes pointFade {
        0% {
          top: 0;
          opacity: 0;
        }
        100% {
          top: -50px;
          opacity: 1;
        }
      }
    }
  }
}
.player-own {
  .player-info {
    .player-name {
      color: $blue;
    }
    .player-point {
      background-color: $blue;
    }
  }
}
</style>