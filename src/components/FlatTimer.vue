<template>
  <div id="FlatTimer" class="hidden circle" :style="{ width: `${size}px`, height: `${size}px` }">
    <canvas ref="canvas" :width="size" :height="size"></canvas>
    <span class="time">{{ timeNow }}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
export default defineComponent({
  props: {
    limitTime: {
      type: Number,
      default: 10,
    },
    size: {
      type: Number,
      default: 50,
    },
    lineWidth: {
      type: Number,
      default: 4,
    },
  },
  setup({ limitTime, size, lineWidth }) {
    const canvas: Ref<null | HTMLElement> = ref(null)
    const timeNow: Ref<number> = ref(limitTime)
    onMounted(() => {
      const canvasEle = <HTMLCanvasElement>canvas.value
      canvasEle.width = size * window.devicePixelRatio
      canvasEle.height = size * window.devicePixelRatio
      const ctx = canvasEle.getContext('2d') as CanvasRenderingContext2D
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      drawTimer(ctx, { limitTime: limitTime * 1000, size, lineWidth, initTime: new Date().getTime() })
      const intervalId: number = window.setInterval(() => {
        if (timeNow.value === 0) {
          window.clearInterval(intervalId)
        } else {
          timeNow.value--
        }
      }, 1000)
    })
    return {
      timeNow,
      canvas,
    }
  },
  components: {},
})
type DrawTimerOpt = {
  limitTime: number
  size: number
  lineWidth: number
  initTime: number
}
let timerId: Ref<number> = ref(0)
function drawTimer(ctx: CanvasRenderingContext2D, options: DrawTimerOpt) {
  const { limitTime, size, lineWidth, initTime } = options
  const currentTime: number = new Date().getTime()
  const timeGap: number = currentTime - initTime
  const timeProportion: number = timeGap / limitTime
  ctx.fillStyle = '#b8ccbb'
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(
    size / 2,
    size / 2,
    size / 2 - lineWidth,
    (-1 / 2) * Math.PI,
    2 * Math.PI * timeProportion - (1 / 2) * Math.PI
  )
  ctx.stroke()
  if (timeGap < limitTime) {
    timerId.value = window.requestAnimationFrame(() => {
      drawTimer(ctx, { limitTime, size, lineWidth, initTime })
    })
  } else {
    window.cancelAnimationFrame(timerId.value)
  }
}
</script>
<style lang="scss" scope>
#FlatTimer {
  box-shadow: $PrimaryShadow;
  position: relative;
  .time {
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 20px;
    color: $White;
  }
}
</style>
