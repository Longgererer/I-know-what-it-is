<template>
  <div id="app" class="hidden">
    <router-view />
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Footer from '/@components/Footer.vue'
export default defineComponent({
  name: 'App',
  components: {
    Footer,
  },
})
</script>

<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
  background-image: -webkit-cross-fade($Transparent, url('./assets/bgc.svg'), 30%);
  background-image: cross-fade($Transparent, url('./assets/bgc.svg'), 30%);
  background-size: 400px;
}
</style>
