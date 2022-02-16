import { FreeObjT } from '@/@types'
import { switchType } from './socketTools'

export default class Socket {
  // 要连接的URL
  url: string = ''
  // WebSocket 实例
  ws: WebSocket | null = null
  // 延时重连的 id
  timerId: NodeJS.Timer | null = null
  // 延时时间
  timeOut: number = 30000
  // 事件管理
  events: { [key: string]: Function[] } = {}
  // 延迟发送列表，由于触发send方法时连接可能还没有建立，因此把这些待发送的数据缓存起来，连接完成再发送
  delaySendList: FreeObjT[] = []
  // 实例
  static instance: Socket | undefined

  constructor(url: string) {
    if (!Socket.instance) {
      this.url = url
      this.ws = new WebSocket(url)
      this.monitor()
      // this.timerId = setInterval(() => {
      //   if (this.ws !== null) {
      //     this.send('heartBeat')
      //   }
      // }, this.timeOut)
      Socket.instance = this
    }
    return Socket.instance
  }
  monitor(): void {
    const { ws } = this
    ws!.onopen = () => {
      console.log('ws连接已建立')
      this.exeEvent('open', true)
      this.delaySendList.forEach((item) => {
        this.send(item)
      })
    }
    ws!.onmessage = ({ data }) => {
      this.handleType(JSON.parse(data))
    }
    ws!.onclose = (e) => {
      console.log(e)
      this.ws = null
      clearInterval(<NodeJS.Timer>this.timerId)
    }
    ws!.onerror = (e) => {
      console.log(e)
    }
  }
  handleType(data: any): void {
    const finType = <string>switchType(data.type)
    switch (data.type) {
      default: {
        this.exeEvent(finType, data)
      }
    }
  }
  send(data: any): void {
    if (this.ws?.readyState === 1) {
      const finType = <number>switchType(data.type)
      this.ws?.send(JSON.stringify({ ...data, type: finType }))
    } else {
      this.delaySendList.push({ ...data })
    }
  }
  subscribeEvent(type: string, callback: Function): void {
    const eventList: Function[] | undefined = this.events[type]
    if (eventList === undefined) {
      this.events[type] = [callback]
    } else {
      this.events[type].push(callback)
    }
  }
  unsubscribeEvent(type: string, callback: Function): void {
    const eventList: Function[] | undefined = this.events[type]
    for (let i = 0;i < eventList.length;i++) {
      if (eventList[i] === callback) {
        eventList.splice(i, 1)
      }
    }
  }
  unsubscribeAll(): void {
    this.events = {}
  }
  exeEvent(type: string, data: any): void {
    const eventList: Function[] | undefined = this.events[type]
    if (eventList !== undefined) {
      eventList.forEach((fn: Function) => fn(data))
    }
  }
  close(): void {
    this.ws?.close()
  }
}