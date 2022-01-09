export type BaseT = string | number | symbol | null | undefined

export type FreeObjT = Record<string | number | symbol, any>

export interface FlatInputT extends HTMLElement {
  getFocus(): void
  getBlur(): void
}

export type HexT = `#${string[6]}`

export type RgbT = `rgb(${number},${number},${number})`

export interface ListItemT {
  value: string | number | symbol | undefined,
  label: BaseT
}

export interface SocketMsgT {
  type: string
  data: any
}

export interface PlayerT {
  id: number
  name: string
  avatar: FreeObjT
  point: number
  drawer: boolean
}