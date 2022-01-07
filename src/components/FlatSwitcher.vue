<template>
  <div class="flat-switcher">
    <input type="checkbox" id="FlatSwitcher" :checked="modelValue" @change="onchange" />
    <label for="FlatSwitcher"></label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

function onchange() {
  emit('update:modelValue', !props.modelValue)
  emit('change', !props.modelValue)
}
</script>

<style lang="scss">
$namespace: "flat-switcher";
.#{$namespace} {
  width: 60px;
  height: 25px;
  input {
    height: 0;
    width: 0;
    display: none;
    &:checked + label {
      background-color: $main;
    }
    &:checked + label::after {
      left: 100%;
      transform: translateX(-100%);
    }
  }
  label {
    width: 100%;
    height: 100%;
    cursor: pointer;
    text-indent: -9999px;
    background-color: $light-3;
    display: block;
    border-radius: 100px;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: -1px;
      left: 0px;
      width: 25px;
      height: 25px;
      border-radius: 100%;
      background-color: $light-1;
      transition: all 0.3s ease;
      box-shadow: $box-shadow;
    }
  }
}
</style>