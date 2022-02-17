<template>
  <div class="tool-bar flex flex-aic">
    <ul class="palette">
      <li class="curColor" :style="{ backgroundColor: curColor }"></li>
      <li
        v-for="item in palette"
        :key="item"
        :style="{ backgroundColor: item }"
        @click="selectColor(item)"
        class="color"
      ></li>
    </ul>
    <div class="pen-weight flex flex-aic">
      <div class="example-box flex flex-aic flex-jcc">
        <div class="weight-example" :style="weightExampleStyle"></div>
      </div>
      <flat-slider style="width:150px" v-model="weight" :min="1" :max="20" show-number></flat-slider>
      <flat-button
        class="eraser-btn"
        :outline="!eraserSelected"
        icon
        icon-class="icon iconfont icon-eraser"
        @click="selectEraser"
        title="橡皮擦"
      ></flat-button>
      <flat-button
        class="repeal-btn"
        icon
        icon-class="icon iconfont icon-chexiao"
        type="default"
        @click="$emit('repeal')"
        title="撤回"
      ></flat-button>
    </div>
    <div class="flex-1"></div>
    <div class="other-opts">
      <flat-button
        icon
        type="danger"
        class="btn-clear"
        icon-class="icon iconfont icon-bin"
        @click="$emit('clear')"
        title="清空画布"
      ></flat-button>
      <flat-button
        icon
        type="danger"
        class="btn-skip"
        icon-class="icon iconfont icon-skip"
        @click="$emit('skip')"
        title="结束绘画"
      ></flat-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { palette, canvasBgc } from '../utils/publicData'
import { FreeObjT } from '../@types'
import FlatSlider from '@components/FlatSlider.vue'
import FlatButton from '@components/FlatButton.vue'

const emit = defineEmits<{
  (e: 'selectColor', value: string): void
  (e: 'changeWeight', value: number): void
  (e: 'clear'): void
  (e: 'skip'): void
  (e: 'repeal'): void
}>()

const curColor = ref<string>(palette[0])
const eraserSelected = ref<boolean>(false)
const selectColor = (color: string) => {
  curColor.value = color
  eraserSelected.value = false
}
const selectEraser = () => {
  eraserSelected.value = true
  curColor.value = canvasBgc
}
watchEffect(() => {
  emit('selectColor', curColor.value)
})

const weight = ref<number>(8)
const weightExampleStyle = computed<FreeObjT>(() => {
  return {
    width: `${weight.value}px`,
    height: `${weight.value}px`,
    backgroundColor: curColor.value
  }
})

watchEffect(() => {
  emit('changeWeight', weight.value)
})
</script>

<style lang="scss" scoped>
.tool-bar {
  width: 100%;
  height: 100%;
  .palette {
    display: grid;
    grid-template-rows: repeat(2, 20px);
    grid-template-columns: repeat(9, 20px);
    gap: 2px;
    .curColor {
      grid-column-start: 1;
      grid-row-start: 1;
      grid-row-end: 3;
      grid-column-end: 3;
    }
    .color {
      cursor: pointer;
    }
  }
  .pen-weight {
    margin-left: 25px;
    .example-box {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      .weight-example {
        border-radius: 50%;
      }
    }
    .eraser-btn {
      margin-left: 15px;
    }
    .repeal-btn {
      margin-left: 10px;
    }
  }
  .other-opts {
    .btn-skip {
      margin-left: 10px;
    }
  }
}
</style>