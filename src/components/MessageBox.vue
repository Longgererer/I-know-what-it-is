<template>
  <div class="message-box">
    <div class="message-list" ref="messageList">
      <transition-group name="slide">
        <div
          class="message flex flex-col"
          :class="item.isOwn ? 'flex-aie' : 'flex-ais'"
          v-for="(item, index) in messages"
          :key="index"
        >
          <template v-if="item.type === 'answer'">
            <template v-if="item.isOwn">
              <span class="own-answer-message-name">{{ item.name }}</span>
              <div class="own-answer-message-content">
                <span>{{ item.content }}</span>
              </div>
            </template>
            <template v-else>
              <span class="answer-message-name">{{ item.name }}</span>
              <div class="answer-message-content">
                <span>{{ item.content }}</span>
              </div>
            </template>
          </template>
          <template v-else-if="item.type === 'newPlayer'">
            <div class="new-player-message-content">
              <span>{{ item.content }}</span>
            </div>
          </template>
          <template v-else-if="item.type === 'playerQuit'">
            <div class="player-quit-message-content">
              <span>{{ item.content }}</span>
            </div>
          </template>
          <template v-else-if="item.type === 'rightAnswer'">
            <div class="right-answer-message-content">
              <span>{{ item.content }}</span>
            </div>
          </template>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { MessageT } from '@/@types'

interface Props {
  messages: MessageT[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: ''): void
}>()

const messageList = ref<null | HTMLElement>(null)

defineExpose({
  scrollToBottom() {
    nextTick(() => {
      (messageList.value as HTMLElement).scrollTop = (messageList.value as HTMLElement).scrollHeight
    })
  }
})
</script>

<style lang="scss">
.message-box {
  height: 530px;
  margin-bottom: 10px;
  position: relative;
  @extend .scroll-list-margin-fade;
  &::before {
    border-radius: 15px 15px 0 0;
    left: 0;
    width: 100%;
  }
  &::after {
    left: -5px;
  }
  .message-list {
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    @extend .scroll-bar;
    .message {
      margin-bottom: 15px;
      &:first-child {
        margin-top: 10px;
      }
      .answer-message-name {
        color: $main;
      }
      .answer-message-content {
        color: $light-1;
        background-color: $main;
        padding: 6px 20px;
        border-radius: 0 8px 8px;
        font-size: 14px;
        position: relative;
        margin-top: 10px;
        &::before {
          content: "";
          display: block;
          border: 6px solid $main;
          position: absolute;
          top: -6px;
          left: -6px;
          border-top-color: transparent;
          border-left-color: transparent;
          border-bottom-color: transparent;
          transform: rotate(-45deg);
        }
      }
      .own-answer-message-name {
        color: $blue;
      }
      .own-answer-message-content {
        color: $light-1;
        background-color: $blue;
        padding: 6px 20px;
        border-radius: 8px 0 8px 8px;
        font-size: 14px;
        position: relative;
        margin-top: 10px;
        &::before {
          content: "";
          display: block;
          border: 6px solid $blue;
          position: absolute;
          top: -6px;
          right: -6px;
          border-top-color: transparent;
          border-right-color: transparent;
          border-bottom-color: transparent;
          transform: rotate(45deg);
        }
      }
      .new-player-message-content,
      .player-quit-message-content,
      .right-answer-message-content {
        font-size: 14px;
        margin-top: 10px;
        font-weight: 600;
      }
      .new-player-message-content {
        color: $main;
      }
      .player-quit-message-content {
        color: $light-5;
      }
      .right-answer-message-content {
        color: $green;
      }
    }
    .slide-enter-to,
    .slide-leave-from {
      transition: all 0.3s ease;
    }
    .slide-enter-from,
    .slide-leave-to {
      opacity: 0;
      transform: translateX(10px);
    }
  }
}
</style>