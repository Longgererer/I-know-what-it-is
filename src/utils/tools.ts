type RandomNumberOpt = {
  exclude?: number[]
  isFloat?: boolean
}
function getRandomNumber(min: number, max: number, options: RandomNumberOpt = { exclude: [], isFloat: false }): number {
  const { exclude, isFloat } = options
  let result = Math.random() * (max - min + 1) + min
  !isFloat && (result = Math.floor(result))
  return exclude?.includes(result) ? getRandomNumber(min, max, { exclude }) : result
}

function debounce(fn: Function, delay: number = 0, immediate: boolean = false): Function {
  let timeout: number
  return (...args: any[]) => {
    if (immediate && !timeout) fn(...args)
    clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

function removeAllObjProperties<T extends Object, U extends keyof T>(target: T) {
  Object.keys(target).forEach((key) => {
    delete target[key as U]
  })
}

export {
  debounce,
  getRandomNumber,
  removeAllObjProperties
}