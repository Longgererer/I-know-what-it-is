<template>
  <div id="FlatInput" class="flex flex-clo">
    <span class="title" :class="size" v-if="title">{{ title }}</span>
    <input
      class="borbox input-area"
      @input="inputDebounce"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :class="size"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { debounce } from '/@utils/tools'
export default defineComponent({
  props: {
    value: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    delay: {
      type: Number,
      default: 500,
    },
  },
  setup({ lazy, delay }, { emit, attrs }) {
    const changeInputValue = (e: KeyboardEvent): void => {
      emit('update:value', (e.target as HTMLInputElement).value)
    }
    const inputDebounce: Function = lazy ? debounce(changeInputValue, delay) : changeInputValue
    return {
      size: attrs.size || 'medium',
      type: attrs.type || 'text',
      inputDebounce,
    }
  },
})
</script>
<style lang="scss" scope>
#FlatInput {
  width: 100%;
  .title {
    color: $Primary;
  }
  .input-area {
    color: $Gray;
    border: none;
    outline: none;
    padding: 10px 0 5px 0;
    border-bottom: 2px solid $Primary;
    &::placeholder {
      color: $LightGray;
    }
  }
  .medium {
    font-size: 16px;
  }
  .small {
    font-size: 14px;
  }
}
</style>
