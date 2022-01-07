<template>
  <div class="timer">
    <canvas ref="canvas"></canvas>
    <span class="rest-time">{{ restTime }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    limitTime: number
    bgc: string
  }>(),
  {
    limitTime: 10,
    bgc: '#a8bbab',
  }
)

const canvas = ref<null | HTMLCanvasElement>(null)
const restTime = ref<number>(props.limitTime)
const size = 50
const lineWidth = 5

function drawTimer(ctx: CanvasRenderingContext2D) {
  const initTime = Date.now()
  const limitTime = props.limitTime * 1000
  const timerId = ref<number>(0);
  (function render() {
    const curTime = Date.now()
    const timeGap = curTime - initTime
    const timeProportion = timeGap / limitTime
    ctx.clearRect(0, 0, size, size)
    ctx.fillStyle = '#b8ccbb'
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#ffffff'
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
      timerId.value = requestAnimationFrame(() => {
        render()
      })
    } else {
      cancelAnimationFrame(timerId.value)
    }
  })()
}

onMounted(() => {
  const canvasEle = <HTMLCanvasElement>canvas.value
  const dpr = window.devicePixelRatio
  canvasEle.style.width = 50 + 'px'
  canvasEle.style.height = 50 + 'px'
  canvasEle.width = 50 * dpr
  canvasEle.height = 50 * dpr
  const ctx = <CanvasRenderingContext2D>canvasEle.getContext('2d')
  ctx.scale(dpr, dpr)
  drawTimer(ctx)
  const intervalId = setInterval(() => {
    if (restTime.value === 0) {
      clearInterval(intervalId)
    } else {
      restTime.value--
    }
  }, 1000)
})
</script>

<style lang="scss" scoped>
.timer {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: $box-shadow;
  position: relative;
  .rest-time {
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 20px;
    color: $light-1;
  }
}
</style>
