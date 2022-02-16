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
  uid: number
  userName: string
  image: string
  point: number
}

export interface RoomT {
  roomId: number,
  roomName: string,
  max: number,
  num: number,
  accumulate: number,
  tid: number,
  encrypted: 0 | 1,
}

export interface GlobalStateT {
  username: string,
  avatar: string,
  userId: number
}

export interface MessageT {
  id?: number
  name?: string
  isOwn?: boolean
  content: string
  type: string
}