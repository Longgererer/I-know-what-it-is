<template>
  <flat-screen v-model="modelValue" @click="closeModalByScreen">
    <div class="flat-modal">
      <div class="flat-modal-header">
        <div class="flat-modal-title">
          <span>{{ title }}</span>
        </div>
        <div class="flat-modal-close" v-if="showClose">
          <i class="icon iconfont icon-close" @click.stop="closeModalByClose"></i>
        </div>
      </div>
      <div class="flat-modal-content">
        <slot></slot>
      </div>
      <div class="flat-modal-footer" v-if="showFooter">
        <flat-button class="flat-modal-confirm-btn" @click="$emit('confirm')">{{ confirmText }}</flat-button>
      </div>
    </div>
  </flat-screen>
</template>

<script setup lang="ts">
import FlatScreen from '@components/FlatScreen.vue'
import FlatButton from '@components/FlatButton.vue'

interface Props {
  modelValue?: boolean
  title?: string
  showClose?: boolean
  closeOnClickScreen?: boolean
  confirmText?: string
  showFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  showClose: true,
  title: '提示',
  closeOnClickScreen: true,
  confirmText: '确定',
  showFooter: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'closed'): void
}>()

const closeModalByScreen = () => {
  if (props.closeOnClickScreen) {
    emit('update:modelValue', false)
  }
  emit('closed')
}

const closeModalByClose = () => {
  emit('update:modelValue', false)
  emit('closed')
}
</script>

<style lang="scss">
$namespace: "flat-modal";

.#{$namespace} {
  width: 400px;
  box-shadow: $box-shadow;
  background-color: $light-1;
  border-radius: $border-radius;
  .#{$namespace}-header {
    display: flex;
    height: 40px;
    position: relative;
    .#{$namespace}-title {
      height: 100%;
      padding: 0 30px;
      background-color: $main;
      color: $light-1;
      border-radius: $border-radius 0 $border-radius 0;
      font-weight: 600;
      font-size: 18px;
      span {
        line-height: 40px;
      }
    }
    .#{$namespace}-close {
      color: $main;
      position: absolute;
      right: 25px;
      i {
        line-height: 40px;
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
  .#{$namespace}-content {
    padding: 25px;
  }
  .#{$namespace}-footer {
    height: 40px;
    text-align: right;
    .#{$namespace}-confirm-btn {
      height: 40px;
      font-size: 16px;
      border-radius: $border-radius 0 $border-radius 0;
    }
  }
}
</style>