import { socketMsgT, customObjT } from './types'
import { set, get } from './session'

export default class Socket {
  // 要连接的URL
  url: string = ''
  // 一个协议字符串或一个协议字符串数组。
  // 这些字符串用来指定子协议，这样一个服务器就可以实现多个WebSocket子协议
  protocols: string | string[] = ''
  // WebSocket 实例
  ws: WebSocket | null = null
  // 是否在重连中
  isReconnectionLoading: boolean = false
  // 延时重连的 id
  timeId: number | null = null
  // 是否是用户手动关闭连接
  isCustomClose: boolean = false
  // 错误消息队列
  errorStack: Error[] = []
  // 事件管理
  events: { [key: string]: [] } = {}
  static instance: Socket | undefined

  constructor(url: string) {
    if (!Socket.instance) {
      this.url = url
      this.ws = new WebSocket(url)
      this.monitorWs()
      Socket.instance = this
    }
    return Socket.instance
  }
  monitorWs() {
    const { ws, event } = this
    ws!.onopen = (e) => {
      console.trace('open')
    }
    ws!.onmessage = ({ data }) => {
      const { data: content, type } = JSON.parse(data)
      this.typeHandler(type, content)
    }
    ws!.onclose = (e) => {
      console.log(e)
    }
    ws!.onerror = (e) => {
      console.log(e)
    }
  }
  send(msg: socketMsgT): void {
    console.log('send')
    this.ws!.send(JSON.stringify(msg))
  }
  event(name: string, data: any): void {
    let eventsArray = this.events[name]
    eventsArray && eventsArray.forEach((fn: Function) => fn(data))
  }
  typeHandler(type: string, content: customObjT): void {
    switch (type) {
      case 'initUser': {
        // 初始化用户，存储id和token
        const { id, token } = content
        set('userId', id)
        set('token', token)
      }
    }
  }
}