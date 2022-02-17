<template>
  <div class="timer">
    <canvas width="50" height="50" ref="canvas"></canvas>
    <span class="rest-time" v-show="restTime > 0">{{ restTime }}</span>
    <span class="wait-time" v-show="restTime <= 0">wait</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    limitTime: number
    state: number
    isDrawer: boolean
    bgc?: string
  }>(),
  {
    limitTime: 0,
    state: 0,
    isDrawer: false,
    bgc: '#a8bbab',
  }
)

const emit = defineEmits<{
  (e: 'timerEnd'): void
}>()

const canvas = ref<null | HTMLCanvasElement>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const restTime = ref<number>(props.limitTime)
const rafId = ref<number | null>(null)
const timerId = ref<NodeJS.Timer | null>(null)
const size = 50
const lineWidth = 5

const renderTimer = (ctx: CanvasRenderingContext2D, proportion: number) => {
  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = props.bgc
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
    2 * Math.PI * proportion - (1 / 2) * Math.PI
  )
  ctx.stroke()
}

const drawTimer = (ctx: CanvasRenderingContext2D, limitTime?: number) => {
  const initTime = Date.now()
  if (!limitTime || limitTime !== 0) {
    limitTime = props.limitTime * 1000
  }
  function render() {
    const curTime = Date.now()
    const timeGap = curTime - initTime
    const timeProportion = timeGap / (limitTime as number)
    renderTimer(ctx, timeProportion)
    if (timeGap < (limitTime as number)) {
      rafId.value = requestAnimationFrame(() => {
        render()
      })
    } else {
      cancelAnimationFrame(rafId.value as number)
    }
  }
  render()
}

const init = (limitTime?: number) => {
  restTime.value = limitTime || props.limitTime
  const ctxVal = <CanvasRenderingContext2D>ctx.value
  drawTimer(ctxVal, limitTime)
  timerId.value = setInterval(() => {
    if (restTime.value <= 0) {
      clearInterval(timerId.value as NodeJS.Timer)
      emit('timerEnd')
    } else {
      restTime.value--
    }
  }, 984)
}

const resetTimer = () => {
  clearInterval(timerId.value as NodeJS.Timer)
  cancelAnimationFrame(rafId.value as number)
  if (props.limitTime > 0) {
    init()
  }
}

watch(() => props.state, () => {
  restTime.value = props.limitTime
  resetTimer()
})

onMounted(() => {
  const canvasEle = <HTMLCanvasElement>canvas.value
  const dpr = window.devicePixelRatio
  canvasEle.style.width = 50 + 'px'
  canvasEle.style.height = 50 + 'px'
  canvasEle.width = 50 * dpr
  canvasEle.height = 50 * dpr
  ctx.value = <CanvasRenderingContext2D>canvasEle.getContext('2d')
  ctx.value.scale(dpr, dpr)
  if (props.limitTime > 0) {
    restTime.value = props.limitTime
    init()
  }
})

onBeforeUnmount(() => {
  clearInterval(timerId.value as NodeJS.Timer)
  cancelAnimationFrame(rafId.value as number)
})

defineExpose({
  clearTimer() {
    clearInterval(timerId.value as NodeJS.Timer)
    cancelAnimationFrame(rafId.value as number)
  },
  setRestTime(newTime: number) {
    clearInterval(timerId.value as NodeJS.Timer)
    cancelAnimationFrame(rafId.value as number)
    init(newTime)
  },
  resetTimer() {
    resetTimer()
  }
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
  .wait-time {
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 14px;
    color: $light-1;
  }
}
</style>
