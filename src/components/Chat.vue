<template>
  <div id="Chat" class="flex">
    <img :src="`https://api.multiavatar.com/${chatInfo.avatar}.svg`" alt="" class="circle avatar" />
    <div class="text-info borbox flex flex-clo flex-jcb">
      <span class="name text-mini">{{ chatInfo.name }}</span>
      <div class="chat-bubble text-small flex flex-ai flex-jcc">
        {{ chatInfo.text }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    chatInfo: Object,
  },
  setup() {},
})
function handleChatInfo() {}
</script>
<style lang="scss" scoped>
#Chat {
  .avatar {
    width: 30px;
    height: 30px;
    border: 2px solid $Primary;
  }
  .text-info {
    margin-left: 15px;
    .name {
      color: $LightGray;
    }
    .chat-bubble {
      height: 30px;
      padding: 0 5px;
      background-color: $Primary;
      border-radius: 5px;
      color: $White;
      position: relative;
      &::before{
        content: "";
        position: absolute;
        left: -5px;
        top: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid $Primary;
      }
    }
  }
}
</style>
