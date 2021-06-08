const set = (key: string, value: any): void => {
  sessionStorage.setItem(key, value)
}
const get = (key: string): any => sessionStorage.getItem(key)
const remove = (key: string): void => {
  sessionStorage.removeItem(key)
}

export {
  set,
  get,
  remove
}