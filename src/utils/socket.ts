import { socketMsgT } from './types'

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
  instance: Socket | undefined

  constructor(url: string) {
    if (!this.instance) {
      this.url = url
      this.ws = new WebSocket(url)
      this.monitorWs()
      this.instance = this
    }
    return this
  }
  monitorWs() {
    const { ws, event } = this
    ws!.onopen = (e) => {
      console.log(e)
    }
    ws!.onmessage = ({ data }) => {
      console.log(data)
    }
    ws!.onclose = (e) => {
      console.log(e)
    }
    ws!.onerror = (e) => {
      console.log(e)
    }
  }
  send(msg: socketMsgT): void {
    this.ws!.send(JSON.stringify(msg))
  }
  event(name: string, data: any): void {
    let eventsArray = this.events[name]
    eventsArray && eventsArray.forEach((fn: Function) => fn(data))
  }
  typeHandler(type: string): void {
    switch (type) {
      case 'initUser': {

      }
    }
  }
}