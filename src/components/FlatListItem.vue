<template>
  <div
    class="flat-list-item"
    :class="{ 'flat-list-item-selected': curSelected?.value === value }"
    @click.stop="onselect"
  >
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { inject, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { BaseT } from '@/@types'

interface FlatSelectItemT {
  label?: BaseT,
  value?: string | number | symbol | undefined,
}

const props = withDefaults(defineProps<FlatSelectItemT>(), {
  label: undefined,
  value: undefined,
})

if (props.label !== undefined) {
  props.label = props.value
}



const curSelected = inject<FlatSelectItemT>('curSelected')

const vm: ComponentInternalInstance | null = getCurrentInstance()
const onselect = () => {
  (vm as ComponentInternalInstance).parent?.exposed?.onselect?.(props)
}
</script>

<style lang="scss">
$namespace: "flat-list-item";
.#{$namespace} {
  width: 100%;
  font-size: 14px;
  padding: 8px 25px;
  &:hover {
    color: $light-1;
    background-color: $main;
  }
}
.#{$namespace}-selected {
  font-weight: 600;
  color: $main;
}
</style>