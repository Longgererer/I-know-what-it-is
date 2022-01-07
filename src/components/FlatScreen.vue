<template>
  <teleport to="body">
    <div
      class="flat-screen"
      :style="{ backgroundColor: background }"
      @click.self="$emit('click')"
      v-if="modelValue"
    >
      <slot></slot>
    </div>
  </teleport>
</template>

<script setup lang="ts">
interface Props {
  background?: string
  modelValue?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  background: '#ffffffb3',
  modelValue: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<style lang="scss" scoped>
$namespace: "flat-screen";
.#{$namespace} {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>