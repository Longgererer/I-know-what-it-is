const local = {
  get(key: string) {
    const val = localStorage.getItem(key)
    return val === null ? null : JSON.parse(val as string)
  },
  set(key: string, val: any) {
    localStorage.setItem(key, JSON.stringify(val))
  }
}

export {
  local
}