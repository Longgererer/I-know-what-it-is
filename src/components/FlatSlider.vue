<template>
  <div id="FlatSlider" ref="slider" @click.self="movePosition" class="pointer">
    <div class="cover" @click.self="movePosition" :style="{ width: `${((value - min) / (max - min)) * 100}%` }">
      <div class="cover-btn" @mousedown.stop.prevent="onButtonDown"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, toRefs, onMounted } from 'vue'
export default defineComponent({
  props: {
    value: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    /**
     * 需要保存一个未响应式的props.value：rawValue 和响应式的props.value：inputValue
     * 这是为了正确地在onDragging根据鼠标移动位置改变value而不受inputValue的影响
     */
    const { value: inputValue, min, max } = toRefs(props)
    let rawValue: number = props.value
    const slider: Ref<null | HTMLElement> = ref(null)
    const sliderWidth: Ref<number> = ref(0)
    const starX: Ref<number> = ref(0)
    const stepLen: Ref<number> = ref(1) // 每一步占据长度，单位px
    onMounted(() => {
      sliderWidth.value = (<HTMLElement>slider.value).clientWidth
      stepLen.value = sliderWidth.value / (max.value - min.value)
    })
    const onDragging = (event: MouseEvent) => {
      let diff: number = 0
      const currentX: number = event.clientX
      diff = currentX - starX.value
      const gap: number = diff / stepLen.value
      let result: number = rawValue + gap
      if (result >= max.value) {
        result = max.value
      } else if (result <= min.value) {
        result = min.value
      } else {
        const fraction = result - Math.floor(result)
        if (fraction >= 0.5) {
          result = Math.floor(result) + 1
        } else {
          result = Math.floor(result)
        }
      }
      emit('update:value', result)
    }
    const onDragEnd = () => {
      window.removeEventListener('mousemove', onDragging)
      window.removeEventListener('mouseup', onDragEnd)
    }
    const onButtonDown = (event: MouseEvent) => {
      starX.value = event.clientX
      rawValue = inputValue.value
      window.addEventListener('mousemove', onDragging)
      window.addEventListener('mouseup', onDragEnd)
    }
    const movePosition = (event: MouseEvent) => {
      const targetX: number = event.offsetX
      let result: number = targetX / stepLen.value
      const fraction: number = result - Math.floor(result)
      console.log(`targetX:${targetX}`)
      console.log(`result:${result}`)
      console.log(`fraction:${fraction}`)
      if (fraction >= 0.5) {
        result = Math.floor(result) + 1
      } else {
        result = Math.floor(result)
      }
      emit('update:value', min.value + result)
    }
    return {
      movePosition,
      onButtonDown,
      slider,
    }
  },
})
</script>
<style lang="scss" scope>
#FlatSlider {
  width: 100%;
  height: 6px;
  background-color: $LightGray;
  border-radius: 3px;
  .cover {
    height: 100%;
    background-color: $Primary;
    position: relative;
    border-radius: 3px;
    .cover-btn {
      content: '';
      position: absolute;
      display: block;
      box-sizing: border-box;
      border: 2px solid $Primary;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: $White;
      right: -8px;
      bottom: -5px;
      cursor: pointer;
      @include Transition(all, 0.3s, ease);
      &:hover {
        transform-origin: center;
        transform: scale(1.3);
      }
    }
  }
}
</style>
