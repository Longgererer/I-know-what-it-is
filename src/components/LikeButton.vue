<template>
  <div @click.stop="onclick">
    <button
      class="like-button flex flex-aic flex-jcc"
      :class="[
        `like-button--${type}`,
        active ? 'like-button--active' : ''
      ]"
    >
      <i :class="iconClass"></i>
      <div class="like-button-inner flex flex-aic flex-jcc">
        <i :class="iconClass"></i>
      </div>
      <div class="shining-dot">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
  iconClass?: string
  type?: string
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  iconClass: '',
  type: 'default',
  active: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const onclick = () => {
  emit('click')
}
</script>

<style lang="scss">
$namespace: "like-button";

.#{$namespace} {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease-in-out;
  background-color: $light-1;
  &:active {
    transform: scale(0.8);
  }
  & > i {
    font-size: 64px;
  }
  .#{$namespace}-inner {
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    width: 0;
    height: 0;
    transition: all 0.3s ease-in-out;
    & > i {
      color: $light-1;
      font-size: 64px;
    }
  }
  .shining-dot {
    position: absolute;
    top: -10px;
    transition: all 0.3s ease-in-out;
    span {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 3px;
      transition: all 0.3s ease-in-out;

      opacity: 0;
    }
    span:nth-child(1) {
      transform: rotate(-30deg) translateX(-20px);
    }
    span:nth-child(3) {
      transform: rotate(30deg) translateX(20px);
    }
  }
}
.#{$namespace}--active {
  .#{$namespace}-inner {
    width: 100%;
    height: 100%;
  }
  .shining-dot {
    top: -30px;
    span {
      animation: dot-fade 0.5s ease-in-out;
    }
    // span:nth-child(1) {
    //   animation: dot-fade 0.3s ease-in-out infinite;
    // }
    // span:nth-child(3) {
    //   transform: rotate(30deg) translateX(20px);
    // }
  }
}
@keyframes dot-fade {
  0% {
    opacity: 0;
    margin-bottom: -15px;
    height: 6px;
  }
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
    margin-bottom: 10px;
    height: 12px;
  }
}

@each $type in (default, danger) {
  .#{$namespace}--#{$type} {
    border: 4px solid map-get($flat-btn-bgc, $type);
    & > i {
      color: map-get($flat-btn-bgc, $type);
    }
    .#{$namespace}-inner {
      background-color: map-get($flat-btn-bgc, $type);
    }
    .shining-dot {
      span {
        background-color: map-get($flat-btn-bgc, $type);
      }
    }
  }
  .#{$namespace}--#{$type}.#{$namespace}--active {
    background-color: map-get($flat-btn-bgc, $type);
  }
}
</style>