<template>
  <div id="Board" ref="board">
    <canvas
      ref="canvas"
      class="canvas"
      :class="{ 'cursor-default': cursorType === 'default' }"
      @mousemove="onMouseMove"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @mouseleave="onMouseLeave"
      @mouseenter="onMouseEnter"
    ></canvas>
    <div
      class="cursor circle"
      :class="{ [`cursor-${cursorType}`]: true, 'cursor-drawing': isDrawing, 'cursor-active': showBrushCursor }"
      :style="cursorStyle"
    ></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, Ref, computed, ComputedRef } from 'vue'
export default defineComponent({
  props: {
    penColor: {
      type: String,
      default: '#000000',
    },
    lineWidth: {
      type: Number,
      default: 8,
    },
    cursorType: {
      type: String,
      default: 'default', // default|pen
    },
  },
  setup(props) {
    const board: Ref<null | HTMLElement> = ref(null)
    const canvas: Ref<null | HTMLElement> = ref(null)
    const canvasSize = reactive({ width: 0, height: 0 })
    const ctx: Ref<null | CanvasRenderingContext2D> = ref(null)
    const isDrawing: Ref<boolean> = ref(false)
    const showBrushCursor: Ref<boolean> = ref(false)
    const starPosition = reactive({ x: 0, y: 0 })
    const init = (ctx: CanvasRenderingContext2D) => {
      const { width, height } = canvasSize
      ctx.beginPath()
      ctx.rect(0, 0, width, height)
      ctx.fillStyle = '#F2F2F2'
      ctx.fill()
    }
    const draw = (event: MouseEvent, ctx: CanvasRenderingContext2D) => {
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.lineWidth = props.lineWidth
      ctx.strokeStyle = props.penColor
      ctx.beginPath()
      const { x, y } = starPosition
      ctx.moveTo(x, y)
      const { offsetX, offsetY } = event
      ctx.lineTo(offsetX, offsetY)
      ctx.stroke()
      Object.assign(starPosition, { x: offsetX, y: offsetY })
    }
    const clearCanvas = () => {
      init(ctx.value as CanvasRenderingContext2D)
    }
    const onMouseMove = (event: MouseEvent) => {
      if (isDrawing.value) draw(event, ctx.value as CanvasRenderingContext2D)
      const { offsetX: x, offsetY: y } = event
      Object.assign(starPosition, { x, y })
    }
    const onMouseEnter = () => {
      showBrushCursor.value = true
    }
    const onMouseDown = () => {
      isDrawing.value = true
    }
    const onMouseUp = () => {
      isDrawing.value = false
    }
    const onMouseLeave = () => {
      isDrawing.value = false
      showBrushCursor.value = false
    }

    // lifecycle
    onMounted(() => {
      const { clientWidth: width, clientHeight: height } = <HTMLElement>board.value
      ctx.value = <CanvasRenderingContext2D>(canvas.value as HTMLCanvasElement).getContext('2d')
      Object.assign(ctx.value.canvas, { width, height })
      Object.assign(canvasSize, { width, height })
      init(ctx.value)
    })
    // computed
    const cursorStyle: ComputedRef<Object> = computed(() => {
      const { lineWidth, penColor } = props
      const { x, y } = starPosition
      return {
        backgroundColor: penColor,
        width: `${lineWidth}px`,
        height: `${lineWidth}px`,
        transform: `translate(${x - lineWidth / 2}px,${y - lineWidth / 2}px)`,
      }
    })

    return {
      board,
      canvas,
      onMouseMove,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onMouseEnter,
      starPosition,
      cursorStyle,
      clearCanvas,
      isDrawing,
      showBrushCursor,
    }
  },
})
</script>
<style lang="scss" scope>
#Board {
  width: 100%;
  height: 100%;
  position: relative;
  .canvas {
    cursor: none;
  }
  .cursor {
    cursor: none;
    position: absolute;
    z-index: 1;
    border: 2px solid $Gray;
    left: 0;
    top: 0;
    pointer-events: none;
    user-select: none;
    opacity: 0;
    @include Transition(opacity, 0.3s, ease);
  }
  .cursor-active {
    opacity: 1;
  }
  .cursor-drawing {
    border: 2px solid $White;
  }
  .cursor-default {
    cursor: default;
  }
  .cursor-eraser {
    cursor: none;
  }
  .cursor-pen {
    cursor: none;
  }
}
</style>
