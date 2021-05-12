<template>
  <div id="Loader" class="flex flex-clo flex-ai flex-jcc">
    <div class="loading-icon">
      <i class="icon iconfont icon-Loading"></i>
    </div>
    <span class="text-small describe-text" v-if="showText">{{ text }}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    showText: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      default: 'Loading...',
    },
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
#Loader {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.9);
  color: $Primary;
  z-index: 1000;
  .loading-icon {
    i {
      display: block;
      font-size: 30px;
      @include Animation(myRotate, 1s, infinite, ease);
    }
  }
  .describe-text{
    margin-top: 10px;
  }
}
</style>
