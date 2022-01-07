<template>
  <button
    class="flat-button"
    :class="[
      `flat-button--${size}`,
      `flat-button--${type}`,
      icon ? 'flat-button-only-icon' : '',
      disabled ? 'flat-button-disabled' : '',
      shadow ? 'flat-button-shadow' : '',
      outline ? 'flat-button-outline' : ''
    ]"
    :disabled="disabled"
    @click.stop="$emit('click')"
  >
    <span class="flat-button-content">
      <i v-if="icon || showIcon" class="flat-button-icon" :class="iconClass"></i>
      <slot v-if="!icon"></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  size?: string
  disabled?: boolean
  icon?: boolean
  iconClass?: string
  type?: string
  showIcon?: boolean
  shadow?: boolean
  outline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  disabled: false,
  type: 'primary',
  icon: false,
  iconClass: '',
  showIcon: false,
  shadow: false,
  outline: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<style lang="scss">
$namespace: "flat-button";
.#{$namespace} {
  border: none;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: $light-1;
  user-select: none;
  font-family: $font;
  &::before {
    content: "";
    transition: opacity 0.3s ease;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: block;
    border-radius: inherit;
  }
  .#{$namespace}-icon {
    font-size: inherit;
    margin-right: 10px;
    color: inherit;
  }
}
.#{$namespace}.#{$namespace}-disabled {
  pointer-events: none;
  box-shadow: none;
  &::before {
    background-color: $light-3;
  }
}
.#{$namespace}.#{$namespace}-only-icon {
  border-radius: 50%;
  .#{$namespace}-icon {
    margin-right: 0;
  }
}
.#{$namespace}.#{$namespace}-shadow {
  box-shadow: $box-shadow;
}
@each $type in (default, primary, danger) {
  .#{$namespace}--#{$type} {
    color: map-get($flat-btn-color, $type);
    &::before {
      background-color: map-get($flat-btn-bgc, $type);
    }
    &:hover {
      &::before {
        opacity: 0.7;
      }
    }
    .#{$namespace}-content {
      position: relative;
      color: inherit;
    }
  }
  .#{$namespace}--#{$type}.#{$namespace}-outline {
    color: map-get($flat-btn-bgc, $type);
    &::before {
      border: 2px solid map-get($flat-btn-bgc, $type);
      background-color: map-get($flat-btn-color, $type);
    }
  }
}
@each $size in (small, medium, large, xLarge) {
  $font-size: map-get($flat-font-size, $size);
  $padding: map-get($flat-horizontal-padding, $size);
  .#{$namespace}--#{$size} {
    height: calc($font-size + 2.6 * $padding);
    border-radius: map-get($flat-border-radius, $size);
    padding: 0 25px;
    font-size: $font-size;
  }
  .#{$namespace}--#{$size}.#{$namespace}-only-icon {
    padding: 0 calc(1.3 * $padding);
  }
}
</style>