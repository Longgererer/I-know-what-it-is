<template>
  <div id="Footer" class="flex flex-jcc flex-ai text-shadow">
    <span class="copyright-text">Power by lliiooiill</span>
    <a href="https://github.com/Longgererer/I-know-what-it-is" target="blank" class="pointer">
      <i class="copyright-icon icon iconfont icon-github"></i>
    </a>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Footer',
})
</script>
<style lang="scss" scope>
#Footer {
  width: 100%;
  color: $Primary;
  .copyright-text {
    margin-right: 25px;
  }
  .copyright-icon {
    font-size: 32px;
    color: $Primary;
  }
}
</style>
