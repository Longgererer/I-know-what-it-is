<template>
  <div id="FlatNumberInput" class="flex">
    <input type="text" :value="value" class="text-medium" />
    <div class="num-btn flex flex-clo">
      <button class="up flex-1 pointer" @click="handleUp"><i class="icon iconfont icon-down"></i></button>
      <button class="down flex-1 pointer" @click="handleDown"><i class="icon iconfont icon-down"></i></button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    value: {
      type: Number,
      default: 4,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 10,
    },
    step: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    handleUp(): void {
      const newNum: number = this.value + this.step
      if (newNum > this.max) return void 0
      this.$emit('update:value', newNum)
    },
    handleDown(): void {
      const newNum: number = this.value - this.step
      if (newNum < this.min) return void 0
      this.$emit('update:value', newNum)
    },
  },
})
</script>
<style lang="scss" scope>
#FlatNumberInput {
  input {
    width: 60px;
    height: 32px;
    outline: none;
    color: $Gray;
    border: 2px solid $Primary;
    border-radius: 5px 0 0 5px;
    border-right: none;
    padding: 0 5px;
  }
  .num-btn {
    width: 25px;
    height: 100%;
    button {
      box-sizing: border-box;
      border: none;
      background-color: transparent;
      border: 2px solid $Primary;
      i {
        font-size: 12px;
        color: $Gray;
      }
      &:hover {
        i {
          color: $Primary;
        }
      }
    }
    .up {
      border-top-right-radius: 5px;
      i {
        display: inline-block;
        transform: rotate(180deg);
      }
    }
    .down {
      border-bottom-right-radius: 5px;
      border-top: none;
    }
  }
}
</style>
