<template>
  <button id="FlatButton" class="hidden borbox" :class="`btn-${size} btn-${type}`" :disabled="disabled">
    <div class="disabled-screen" v-show="disabled"></div>
    <div class="btn-content flex flex-jcc flex-ai pointer">
      <i class="icon iconfont icon-Loading" v-show="loading"></i>
      <i class="icon iconfont text-shadow" v-if="showIcon" :class="`${icon}`"></i>
      <div class="content text-small text-shadow">
        <slot></slot>
      </div>
    </div>
  </button>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    showIcon: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, { attrs }) {
    return {
      type: attrs.type || 'primary', // primary|cancel|danger
      size: attrs.size || 'medium', // small|medium|large
    }
  },
})
</script>
<style lang="scss" scope>
@include Keyframes(myRotate) {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
#FlatButton {
  width: 100%;
  outline: none;
  border-radius: 5px;
  position: relative;
  .disabled-screen {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: $White;
    opacity: 0.5;
  }
  .btn-content {
    width: 100%;
    height: 100%;
    i {
      font-size: 24px;
      color: $White;
      margin-right: 12px;
    }
    .icon-Loading {
      display: block;
      font-size: 14px;
      @include Animation(myRotate, 1s, infinite, linear);
    }
  }
}
.btn-primary {
  color: $White;
  border: none;
  .btn-content {
    color: inherit;
    background-color: $Primary;
    &:hover {
      background-color: $PrimaryHover;
    }
  }
}
.btn-cancel {
  border: 1px solid $LightGray;
  margin-right: 20px;
  color: $LightGray;
  .btn-content {
    background-color: $White;
    color: inherit;
    &:hover {
      background-color: $ShallowWhite;
    }
  }
}
.btn-medium {
  height: 40px;
}
.btn-small {
  height: 30px;
}
</style>
