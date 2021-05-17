<template>
  <div id="User" class="flex noselect">
    <img :src="`https://api.multiavatar.com/${userInfo.avatar}.svg`" alt="" class="avatar borbox circle" />
    <div class="text-info text-small flex flex-clo flex-jcb">
      <span class="name text-ellipsis">{{ userInfo.name }}</span>
      <div class="point flex flex-ai flex-jcc text-shadow">
        <span>{{ userInfo.point }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    userInfo: Object,
  },
})
</script>
<style lang="scss" scoped>
#User {
  width: 100%;
  .avatar {
    width: 40px;
    height: 40px;
    border: 2px solid $Primary;
    margin-right: 10px;
  }
  .text-info {
    color: $Primary;
    width: calc(100% - (40px + 15px));
    .name{
      // width: 100px;
    }
    .point {
      width: 60px;
      height: 20px;
      background-color: $Primary;
      color: $White;
      border-radius: 10px;
    }
  }
}
</style>
