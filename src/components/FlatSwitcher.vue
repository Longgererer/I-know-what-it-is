<template>
  <div id="FlatSwitcher">
    <input type="checkbox" id="switch" :checked="value" @change="changeSwitchValue" />
    <label for="switch"></label>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    changeSwitchValue(e: MouseEvent): void {
      this.$emit('update:value', (e.target as HTMLInputElement).checked)
    },
  },
})
</script>
<style lang="scss" scope>
#FlatSwitcher {
  width: 40px;
  height: 20px;
  input {
    height: 0;
    width: 0;
    display: none;
    &:checked + label {
      background-color: $Primary;
    }
    &:checked + label::after {
      left: calc(100% - 2px);
      transform: translateX(-100%);
    }
  }
  label {
    width: 100%;
    height: 100%;
    cursor: pointer;
    text-indent: -9999px;
    background-color: $Gray;
    display: block;
    border-radius: 100px;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: calc(50% - 4px);
      height: calc(100% - 4px);
      border-radius: calc(100%);
      background-color: $White;
      transition: all 0.3s ease;
    }
    &:active::after {
      width: calc(50% + 5px);
    }
  }
}
</style>
