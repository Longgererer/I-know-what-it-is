<template>
  <flat-screen v-model="modelValue" @click="closeLoader">
    <div class="flex flex-col flex-aic">
      <loader></loader>
      <div :class="slotClass">
        <slot></slot>
      </div>
    </div>
  </flat-screen>
</template>

<script setup lang="ts">
import FlatScreen from '@components/FlatScreen.vue'
import Loader from '@components/Loader.vue'

const props = defineProps<{
  modelValue?: boolean
  slotClass?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function closeLoader() {
  emit('update:modelValue', false)
}
</script>

<style lang="scss">
.screen-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffffb3;
  z-index: 9999;
}
</style>