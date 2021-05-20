<template>
  <div id="FlatSelect" class="flex flex-ai" v-click-outside="() => (showList = false)">
    <div class="input-area pointer" @click="showList = !showList">
      <input
        class="pointer noselect"
        type="text"
        :class="size"
        :placeholder="placeholder"
        :readOnly="readOnly"
        :value="currentItem.value"
      />
    </div>
    <div class="arrow pointer" @click="showList = !showList">
      <i class="icon iconfont icon-down text-small" :class="showList && 'arrow-active'"></i>
    </div>
    <div class="list-box box-shadow">
      <ul
        class="list hidden borbox flex flex-clo flex-jcc"
        :style="{ height: `${showList ? data.length * 30 + 10 : 0}px` }"
      >
        <li
          v-for="item in data"
          :key="item.id"
          @click="selectItem(item)"
          class="item flex flex-ai pointer"
          :class="`${size} ${currentItem.id === item.id && 'item-active'}`"
        >
          {{ item.value }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { clickOutside } from '/@utils/directives'
export default defineComponent({
  props: {
    currentItem: {
      type: Object,
      default: {},
    },
    title: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'medium',
    },
    readOnly: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Array,
      default: [],
    },
  },
  directives: { clickOutside },
  emits: ['change'],
  setup(_, { emit }) {
    const showList: Ref<boolean> = ref(false)
    const selectItem: Function = (item: any): void => {
      showList.value = !showList.value
      emit('change', item)
    }
    return {
      showList,
      selectItem,
    }
  },
})
</script>
<style lang="scss" scope>
#FlatSelect {
  width: 100%;
  border-bottom: 2px solid $Primary;
  position: relative;
  .input-area {
    width: 100%;
    input {
      width: 100%;
      color: $Gray;
      border: none;
      outline: none;
      padding: 10px 0 5px 0;
      &::placeholder {
        color: $LightGray;
      }
    }
  }
  .medium {
    font-size: 16px;
  }
  .small {
    font-size: 14px;
  }
  .arrow {
    color: $Primary;
    padding-top: 2px;
    i {
      @include Transition(all, 0.3s, ease);
      display: block;
    }
    .arrow-active {
      transform: rotate(180deg);
    }
  }
  .list-box {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    width: 100%;
    border-radius: 5px;
    z-index: 1001;
    background-color: $White;
    .list {
      @include Transition(height, 0.3s, ease);
      .item {
        height: 30px;
        color: $LightGray;
        padding-left: 5px;
        &:hover {
          color: $White;
          background-color: $Primary;
        }
      }
      .item-active {
        color: $White;
        background-color: $Primary;
      }
    }
  }
}
</style>
