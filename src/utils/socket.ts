export default class Socket {
  // 要连接的URL
  private url: string = ''
  // 一个协议字符串或一个协议字符串数组。
  // 这些字符串用来指定子协议，这样一个服务器就可以实现多个WebSocket子协议
  private protocols: string | string[] = ''
  // WebSocket 实例
  private ws: WebSocket
  // 是否在重连中
  private isReconnectionLoading: boolean = false
  // 延时重连的 id
  private timeId: number | null = null
  // 是否是用户手动关闭连接
  private isCustomClose: boolean = false
  // 错误消息队列
  private errorStack: Error[] = []
  // 事件管理
  private events: { [key: string]: [] } = {}

  constructor(url: string) {
    this.url = url
    this.ws = new WebSocket(url)
    this.monitorWs()
  }
  private monitorWs() {
    const { ws, event } = this
    ws.onopen = (e) => {
      console.log(e)
    }
    ws.onmessage = ({ data }) => {
      console.log(data)
    }
    ws.onclose = (e) => {
      console.log(e)
    }
    ws.onerror = (e) => {
      console.log(e)
    }
  }
  send(){
    this.ws.send('123')
  }
  event(name: string, data: any) {
    let eventsArray = this.events[name]
    eventsArray && eventsArray.forEach((fn: Function) => fn(data))
  }
}