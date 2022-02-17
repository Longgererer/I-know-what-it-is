<template>
  <!-- 全屏加载动画 -->
  <screen-loader
    v-model="loadWSModalVisible"
    slot-class="app-loader-content"
    :close-by-click="false"
  >
    <span>连接服务器中...</span>
  </screen-loader>
  <router-view></router-view>
  <div id="preload-box">
    <div id="preload-01"></div>
    <div id="preload-02"></div>
    <div id="preload-03"></div>
  </div>
</template>
<script setup lang="ts">
import ScreenLoader from '@components/ScreenLoader.vue'

import { ref, onMounted, ComponentInternalInstance, getCurrentInstance } from 'vue'
import { FreeObjT } from '@/@types'

const vm: ComponentInternalInstance | null = getCurrentInstance()

// 全屏ws连接加载
const loadWSModalVisible = ref<boolean>(true)

onMounted(() => {
  const ws = vm!.appContext.config.globalProperties.$ws
  ws.subscribeEvent('open', (resp: FreeObjT) => {
    if (resp) {
      loadWSModalVisible.value = false
    }
  })
})


</script>
<style lang="scss">
.app-loader-content {
  color: $main;
  font-size: 20px;
  margin-top: 20px;
}
#preload-01 {
  background: url(../public/images/rank-1.svg) no-repeat -9999px -9999px;
}
#preload-02 {
  background: url(../public/images/rank-2.svg) no-repeat -9999px -9999px;
}
#preload-03 {
  background: url(../public/images/rank-3.svg) no-repeat -9999px -9999px;
}
</style>
