<template>
  <div class="theme" :class="{ 'theme-active': selected }" @click.stop="$emit('click')">
    <span>{{ text }}</span>
    <i class="icon iconfont icon-success"></i>
  </div>
</template>

<script setup lang="ts">
import { BaseT } from '@/@types'

interface Props {
  text?: BaseT
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  selected: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<style lang="scss" scoped>
.theme {
  color: $light-4;
  background-color: $light-1;
  font-size: 16px;
  border: 2px solid $light-3;
  border-radius: 8px;
  padding: 8px 0;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  i {
    position: absolute;
    right: 15px;
    transform: translateY(-50%);
    top: 50%;
    opacity: 0;
  }
  &:hover {
    border-color: $main;
    color: $main;
  }
}
.theme-active {
  background-color: $main !important;
  border-color: $main !important;
  color: $light-1 !important;
  box-shadow: $box-shadow;
  i {
    opacity: 1 !important;
  }
}
</style>