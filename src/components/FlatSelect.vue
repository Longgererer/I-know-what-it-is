<template>
  <div class="flat-select" :class="`flat-select--${size}`" @click.stop="triggerDropdown">
    <flat-input
      ref="input"
      v-model="curBindItem.label"
      readonly
      :size="size"
      :placeholder="placeholder"
    ></flat-input>
    <div
      class="flat-select-arrow flex flex-aic"
      :class="{ 'flat-select-arrow-active': showDropdownOpts }"
      @click="input?.getFocus"
    >
      <i class="icon iconfont icon-down"></i>
    </div>
    <div
      class="flat-select-drop-down"
      :class="{ 'flat-select-drop-down-active': showDropdownOpts }"
      v-show="showDropdownOpts"
    >
      <slot>no data</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, provide } from 'vue'
import { FlatInputT, ListItemT } from '../@types'
import FlatInput from '@components/FlatInput.vue'

interface Props {
  size?: string
  clearable?: boolean
  placeholder?: string
  modelValue?: any
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  placeholder: '',
  clearable: false,
  modelValue: { label: '', value: '' },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: ListItemT): void
}>()

const curBindItem = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

provide('curSelected', curBindItem)

const input = ref<null | FlatInputT>(null)
const showDropdownOpts = ref<boolean>(false)

const triggerDropdown = () => {
  (input.value as FlatInputT).getFocus()
  showDropdownOpts.value = !showDropdownOpts.value
}

const hideDropdown = () => {
  showDropdownOpts.value = false;
  (input.value as FlatInputT).getBlur()
}

onMounted(() => {
  document.body.addEventListener('click', hideDropdown)
})

onUnmounted(() => {
  document.body.removeEventListener('click', hideDropdown)
})

defineExpose({
  onselect(newItem: ListItemT) {
    triggerDropdown()
    if (newItem.value !== props.modelValue.value) {
      curBindItem.value = newItem
      emit('change', newItem)
    }
  },
})
</script>

<style lang="scss">
$namespace: "flat-select";
.#{$namespace} {
  position: relative;
  cursor: pointer;
  .flat-input input {
    cursor: pointer;
  }
  .#{$namespace}-arrow {
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    transition: transform 0.3s ease;
    i {
      font-weight: 600;
      color: $light-4;
    }
  }
  .#{$namespace}-arrow-active {
    transform: rotate(180deg);
  }
  .#{$namespace}-drop-down {
    width: 100%;
    position: absolute;
    top: 100%;
    top: 100%;
    opacity: 0;
    background-color: $light-1;
    box-shadow: $box-shadow;
    z-index: 1000;
  }
  .#{$namespace}-drop-down-active {
    opacity: 1;
  }
}
@each $size in (small, medium, large) {
  .#{$namespace}--#{$size} {
    .#{$namespace}-arrow {
      font-size: map-get($flat-font-size, $size);
    }
    .#{$namespace}-drop-down {
      border-radius: map-get($flat-border-radius, $size);
      padding: map-get($flat-horizontal-padding, $size) 0;
    }
  }
}
</style>