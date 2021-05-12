<template>
  <div id="Home" class="borbox flex flex-clo flex-ai">
    <router-view v-slot="{ Component }">
      <keep-alive include="HomeMenu">
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Home',
})
</script>

<style lang="scss" scope>
#Home {
  width: 700px;
  height: 450px;
  box-shadow: $PrimaryShadow;
  background-color: $White;
  border-radius: 20px;
  margin: 0 auto;
  margin-top: 100px;
  margin-bottom: 15px;
  padding: 35px 45px;
}
</style>
