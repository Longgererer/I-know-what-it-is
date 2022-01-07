<template>
  <div class="flat-slider" ref="flatSlider" @click.self="movePosition">
    <div class="flat-slider-cover" @click.self="movePosition"
      :style="{ width: `${((modelValue - min) / (max - min)) * 100}%` }">
      <div class="flat-slider-cover-btn" :class="{'flat-slider-cover-btn-active':isActive}"
        @mousedown.stop.prevent="onButtonDown">
        <div class="flat-slider-label" :class="{'flat-slider-label-active':isActive}">
          <span>{{modelValue}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue'

interface Props {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  showNumber?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  showNumber: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

/**
 * 需要保存一个未响应式的 props.value：rawValue 和响应式的 props.value：inputValue
 * 这是为了正确地在 onDragging 根据鼠标移动位置改变 value 而不受 inputValue 的影响
 */
const { modelValue: inputValue, min, max, step } = toRefs(props)
let rawValue: number = props.modelValue

/**
 * 获取slider的宽度，通过比例判断位置
 */
const flatSlider = ref<null|HTMLElement>(null)
const sliderWidth = ref<number>(0)
const startX = ref<number>(0)
const stepLen = ref<number>(0) // 每一步所占据的长度

const isActive = ref<boolean>(false)

onMounted(() => {
  calcWidth()
})

function calcWidth() {
  sliderWidth.value = (flatSlider.value as HTMLElement).clientWidth
  stepLen.value = (sliderWidth.value / (max.value - min.value)) * step.value
}

function onDragging(e: MouseEvent) {
  isActive.value = true
  /**
   * 计算出鼠标点击或拖拽的时候计算出点击或拖拽的位置与原来位置的步数
   */
  const curX = e.clientX
  let paces = (curX - startX.value) / stepLen.value
  const fraction = paces - Math.floor(paces)
  if (fraction >= 0.5) {
    paces = Math.round(paces)
  } else {
    paces = Math.floor(paces)
  }
  let result = rawValue + paces * step.value
  if (result >= max.value) {
    result = max.value
  } else if (result <= min.value) {
    result = min.value
  }
  emit('update:modelValue', result)
}

const onDragEnd = () => {
  isActive.value = false
  window.removeEventListener('mousemove', onDragging)
  window.removeEventListener('mouseup', onDragEnd)
}

const onButtonDown = (e: MouseEvent) => {
  startX.value = e.clientX
  rawValue = inputValue.value
  window.addEventListener('mousemove', onDragging)
  window.addEventListener('mouseup', onDragEnd)
}

const movePosition = (e: MouseEvent) => {
  let paces = e.offsetX / stepLen.value
  const fraction = paces - Math.floor(paces)
  if (fraction >= 0.5) {
    paces = Math.round(paces)
  } else {
    paces = Math.floor(paces)
  }
  let result = paces * step.value
  emit('update:modelValue', min.value + result)
}

defineExpose({
  calcWidth,
})
</script>

<style lang="scss">
$namespace: 'flat-slider';

.#{$namespace} {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background-color: $light-3;
  margin: 5px 0;
  cursor: pointer;
  .#{$namespace}-cover {
    height: 100%;
    position: relative;
    border-radius: inherit;
    background-color: $main;
    cursor: pointer;
    .#{$namespace}-cover-btn {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: $main;
      right: -6px;
      bottom: -3px;
      cursor: pointer;
      transition: all 0.3s ease;
      &::before {
        content: '';
        display: block;
        position: absolute;
        width: 12px;
        height: 12px;
        background-color: $main;
        opacity: 0.5;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
        transition: all 0.3s ease;
      }
      &:hover {
        &::before {
          width: 42px;
          height: 42px;
        }
        .#{$namespace}-label {
          @extend .#{$namespace}-label-active;
        }
      }
      .#{$namespace}-label {
        position: absolute;
        top: -40px;
        left: -10px;
        background-color: $main;
        width: 32px;
        height: 32px;
        color: $light-1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        border-radius: 50% 50% 0;
        transform: translate(-50%, -0%) rotate(45deg) scale(0);
        transform-origin: bottom right;
        transition: transform 0.3s ease;
        span {
          transform: rotate(-45deg);
        }
      }
      .#{$namespace}-label-active {
        transform: translate(-50%, -0%) rotate(45deg) scale(1);
      }
    }
    .#{$namespace}-cover-btn-active {
      &::before {
        width: 42px;
        height: 42px;
      }
    }
  }
}
</style>