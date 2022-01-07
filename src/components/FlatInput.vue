<template>
  <div
    class="flat-input"
    :class="[
      `flat-input--${size}`,
      showLimit ? 'flat-input--limit' : ''
    ]"
  >
    <input
      class="flat-input-inner"
      ref="input"
      :class="{ 'flat-input-inner-append': clearable }"
      v-model="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :type="type"
      :readonly="readonly"
      @blur="$emit('blur', $event)"
      :disabled="disabled"
    />
    <div class="flat-input-append flex flex-aic" v-if="clearable && value" @click.stop="value = ''">
      <i class="icon iconfont icon-close"></i>
    </div>
    <div
      class="flat-input-limit-bar"
      v-if="showLimit && maxlength > 0"
    >{{ value.length }}/{{ maxlength }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  size?: string
  showLimit?: boolean
  maxlength?: number
  clearable?: boolean
  type?: string
  placeholder?: string
  modelValue?: any
  readonly?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium', // small|medium|large
  showLimit: false,
  maxlength: Infinity,
  clearable: false,
  type: 'text',
  placeholder: '',
  modelValue: '',
  readonly: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'blur', value: Event): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

const input = ref<null | HTMLElement>(null)

defineExpose({
  getFocus() {
    (input.value as HTMLElement).focus()
  },
  getBlur() {
    (input.value as HTMLElement).blur()
  },
})
</script>

<style lang="scss">
$namespace: "flat-input";
.#{$namespace} {
  width: 100%;
  position: relative;
  user-select: none;
  .#{$namespace}-inner {
    width: 100%;
    outline: none;
    border: none;
    color: $dark-1;
    border-bottom: 2px solid $light-4;
    background-color: $light-1;
    transition: border 0.3s ease;
    &:focus {
      border-color: $main;
      & ~ .#{$namespace}-limit-bar,
      ~ .#{$namespace}-append {
        color: $main;
      }
    }
    &::placeholder {
      color: $light-4;
      user-select: none;
    }
  }
  .#{$namespace}-append {
    height: 100%;
    cursor: pointer;
    color: $light-4;
    position: absolute;
    top: 0;
    right: 0;
  }
  .#{$namespace}-limit-bar {
    font-size: 14px;
    color: $light-4;
    position: absolute;
    right: 0;
    bottom: -22px;
  }
}
.#{$namespace}--limit {
  margin-bottom: 20px;
}
@each $size in (small, medium, large) {
  $font-size: map-get($flat-font-size, $size);
  .#{$namespace}--#{$size} {
    .#{$namespace}-inner {
      padding: map-get($flat-horizontal-padding, $size) 0;
      font-size: $font-size;
    }
    .#{$namespace}-append {
      i {
        font-size: $font-size;
      }
    }
    .#{$namespace}-inner.#{$namespace}-inner-append {
      padding-right: $font-size;
    }
  }
}
</style>