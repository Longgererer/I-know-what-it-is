<template>
  <teleport to="#FlatModalArea">
    <div id="FlatModal" class="flat-modal" v-if="visible">
      <div class="modal-screen flex flex-clo flex-ai">
        <div class="modal-content borbox">
          <div class="modal-head" v-if="showTitle">
            <span class="text-medium text-bold">{{ title }}</span>
          </div>
          <div class="modal-slot">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    title: {
      type: String,
      default: 'Title',
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
<style lang="scss" scope>
#FlatModal {
  position: absolute;
  z-index: 10000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .modal-screen {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    .modal-content {
      height: auto;
      margin-top: 200px;
      box-shadow: $PrimaryShadow;
      border-radius: 5px;
      min-width: 350px;
      padding: 25px;
      background-color: $White;
      .modal-head {
        color: $Primary;
      }
      .modal-slot {
        margin-top: 15px;
      }
    }
  }
}
</style>
