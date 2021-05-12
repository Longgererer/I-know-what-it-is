import { ObjectDirective, DirectiveBinding } from 'vue'

// map用来缓存目标元素和其监听函数
type ElDirectiveMap = Map<HTMLElement, Function>
const nodeList: ElDirectiveMap = new Map()

// 点击不属于目标元素的其他地方触发该指令
const clickOutside: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    const clickOutsideEvent = function (event: MouseEvent) {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event, el)
      }
    }
    nodeList.set(el, clickOutsideEvent)
    document.addEventListener('click', clickOutsideEvent)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const clickOutsideEvent = function (event: MouseEvent) {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event, el)
      }
    }
    nodeList.set(el, clickOutsideEvent)
    document.addEventListener('click', clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    nodeList.delete(el)
  },
}

export {
  clickOutside
}