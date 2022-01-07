<template>
  <div class="flat-number-input">
    <input type="text" v-model="value" @blur="onblur" />
    <div class="flat-number-input-num-btns">
      <button class="num-btn-up" @click="handleUp">
        <i class="icon iconfont icon-down"></i>
      </button>
      <button class="num-btn-down" @click="handleDown">
        <i class="icon iconfont icon-down"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: number
  min?: number
  max?: number
  step?: number
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: -Infinity,
  max: Infinity,
  step: 1,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: (value: number) => {
    emit('update:modelValue', value)
  },
})

const handleUp = () => {
  const newNum = props.modelValue + props.step
  if (newNum > props.max) {
    return void 0
  }
  emit('update:modelValue', newNum)
}

const handleDown = () => {
  const newNum = props.modelValue - props.step
  if (newNum < props.min) {
    return void 0
  }
  emit('update:modelValue', newNum)
}

const onblur = () => {
  // 输入框失焦时检测输入框内容
  let newNum = parseInt(props.modelValue + '')
  if (newNum < props.min) {
    newNum = props.min
  } else if (newNum > props.max) {
    newNum = props.max
  } else if (Number.isNaN(newNum)) {
    newNum = props.min
  }
  emit('update:modelValue', newNum)
}
</script>

<style lang="scss">
$namespace: "flat-number-input";

.#{$namespace} {
  height: 32px;
  display: flex;
  input {
    width: 100px;
    height: 100%;
    outline: none;
    color: $main;
    border: 2px solid $main;
    border-radius: 4px 0 0 4px;
    border-right: none;
    text-align: center;
  }
  .#{$namespace}-num-btns {
    width: 25px;
    height: 100%;
    display: flex;
    flex-direction: column;
    button {
      height: 50%;
      background-color: $light-1;
      border: 2px solid $main;
      cursor: pointer;
      padding: 0;
      i {
        font-size: 12px;
        color: $main;
      }
      &:hover {
        background-color: $main;
        i {
          color: $light-1;
        }
      }
    }
    .num-btn-up {
      border-top-right-radius: 4px;
      border-bottom-width: 1px;
      i::before {
        display: inline-block;
        transform: rotate(180deg);
      }
    }
    .num-btn-down {
      border-bottom-right-radius: 4px;
      border-top-width: 1px;
    }
  }
}
</style>