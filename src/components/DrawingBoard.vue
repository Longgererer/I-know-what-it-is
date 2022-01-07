<template>
  <div class="drawing-board" ref="board">
    <canvas
      ref="canvas"
      class="canvas"
      @mousemove="onMouseMove"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @mouseleave="onMouseLeave"
      @mouseenter="onMouseEnter"
    ></canvas>
    <div
      class="brush"
      :class="{
        'brush-readonly': readonly,
        'brush-active': showBrush,
        'brush-drawing': drawing,
        'brush-deep': deepColor
      }"
      :style="brushStyle"
    >
      <i
        class="icon iconfont"
        :class="[
          color === canvasBgc ? 'icon-eraser1' : 'icon-pen'
        ]"
        v-if="!readonly"
      ></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watchEffect } from 'vue'
import { canvasBgc } from '@utils/publicData'
import { hex2Rgb, isColorDeep } from '@utils/tools'
import { FreeObjT, HexT } from '../@types'

interface Props {
  color?: HexT | string
  lineWidth?: number
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: '#000000',
  lineWidth: 8,
  readonly: false
})

const deepColor = ref<boolean>(false)

watchEffect(() => {
  deepColor.value = isColorDeep(hex2Rgb(props.color as HexT))
})

const board = ref<null | HTMLElement>(null)
const canvas = ref<null | HTMLCanvasElement>(null)
const ctx = ref<null | CanvasRenderingContext2D>(null)
const canvasSize = reactive<{
  width: number
  height: number
}>({ width: 0, height: 0 })
const init = () => {
  const { width, height } = canvasSize
  const ctxVal = <CanvasRenderingContext2D>ctx.value
  ctxVal.beginPath()
  ctxVal.rect(0, 0, width, height)
  ctxVal.fillStyle = canvasBgc
  ctxVal.fill()
}

const startPos = reactive<{
  x: number
  y: number
}>({ x: 0, y: 0 })
const brushStyle = computed<FreeObjT>(() => {
  const { lineWidth, color } = props
  const { x, y } = startPos
  return {
    backgroundColor: color,
    width: `${lineWidth}px`,
    height: `${lineWidth}px`,
    transform: `translate(${x - lineWidth / 2}px,${y - lineWidth / 2}px)`,
  }
})

const drawLine = (e: MouseEvent) => {
  const ctxVal = <CanvasRenderingContext2D>ctx.value
  ctxVal.lineJoin = 'round'
  ctxVal.lineCap = 'round'
  ctxVal.lineWidth = props.lineWidth
  ctxVal.strokeStyle = props.color
  ctxVal.beginPath()
  const { x, y } = startPos
  const { offsetX, offsetY } = e
  ctxVal.moveTo(x, y)
  ctxVal.lineTo(offsetX, offsetY)
  ctxVal.stroke()
  Object.assign(startPos, { x: offsetX, y: offsetY })
}

const drawing = ref<boolean>(false)
const showBrush = ref<boolean>(false)
const onMouseMove = (e: MouseEvent) => {
  if (drawing.value) {
    drawLine(e)
  } else {
    const { offsetX, offsetY } = e
    Object.assign(startPos, { x: offsetX, y: offsetY })
  }
}
const onMouseEnter = () => {
  showBrush.value = true
}
const onMouseLeave = () => {
  showBrush.value = false
  drawing.value = false
}
const onMouseDown = () => {
  drawing.value = true
}
const onMouseUp = () => {
  drawing.value = false
}

onMounted(() => {
  const { clientWidth: width, clientHeight: height } = <HTMLElement>board.value
  const canvasEle = <HTMLCanvasElement>canvas.value
  ctx.value = <CanvasRenderingContext2D>canvasEle.getContext('2d')
  Object.assign(ctx.value.canvas, { width, height })
  Object.assign(canvasSize, { width, height })
  init()
})

defineExpose({
  clearCanvas() {
    init()
  }
})
</script>

<style lang="scss" scoped>
.drawing-board {
  width: 100%;
  height: 100%;
  position: relative;
  .canvas {
    cursor: none;
    vertical-align: bottom;
  }
  .brush {
    cursor: none;
    position: absolute;
    z-index: 1;
    border: 2px solid $light-3;
    left: 0;
    top: 0;
    pointer-events: none;
    user-select: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 50%;
    i {
      font-size: 18px;
      font-weight: 600;
      position: absolute;
      top: -16px;
      left: 100%;
      z-index: 2;
      color: $main;
    }
  }
  .brush-active {
    opacity: 1;
  }
  .brush-drawing {
    border: 2px solid $dark-1;
  }
  .brush-readonly {
    cursor: default;
  }
  .brush-deep {
    border-color: $light-1;
  }
}
</style>