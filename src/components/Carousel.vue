<template>
  <div
    class="carousel"
    ref="carousel"
    :class="[
      customClass,
      center ? 'carousel--center' : ''
    ]"
  >
    <span class="carousel-text" :style="carouselStyle">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { FreeObjT } from '@/@types'

interface Props {
  text?: string
  fontSize?: number | string
  fontWeight?: string
  customClass?: string
  center?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  customClass: '',
  fontSize: 16,
  fontWeight: 'normal',
  center: false
})

const getTextWidth = (str: string = ''): number => {
  const span = document.createElement('span')
  Object.assign(span.style, {
    display: 'inline-block',
    fontWeight: props.fontWeight,
    fontSize: `${props.fontSize}px`,
  })
  span.textContent = str
  document.body.appendChild(span)
  const result = span.clientWidth
  document.body.removeChild(span)
  return result
}

const carousel = ref<null | HTMLElement>(null)
const carouselWidth = ref<number>(0)
const isMounted = ref<boolean>(false)
onMounted(() => {
  isMounted.value = true
  carouselWidth.value = (carousel.value as HTMLElement).clientWidth
})

const fullWidth = getTextWidth(props.text)
let timerId: null | NodeJS.Timer = null
const carouselStyle = computed<FreeObjT | undefined>(() => {
  if (isMounted.value) {
    let gap = fullWidth - carouselWidth.value
    let delay = 16
    if (gap <= 0) {
      return {
        fontSize: `${props.fontSize}px`,
        fontWeight: props.fontWeight
      }
    } else if (gap < 20) {
      // 如果真实宽度与显示宽度相差不多，则慢速滚动
      delay = 100
    }
    let left = 0
    let func = () => { }
    const style = ref<FreeObjT>({
      fontSize: `${props.fontSize}px`,
      fontWeight: props.fontWeight
    })
    timerId = setInterval(() => {
      style.value.left = `${left}px`
      if (left >= 0) {
        func = () => { left -= 0.2 }
      } else if (left <= -gap) {
        func = () => { left += 0.2 }
      }
      func()
    }, delay)
    return style.value
  } else {
    return {
      fontSize: `${props.fontSize}px`,
      fontWeight: props.fontWeight
    }
  }
})
</script>

<style lang="scss">
.carousel {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  .carousel-text {
    position: relative;
  }
}
.carousel--center {
  text-align: center;
}
</style>