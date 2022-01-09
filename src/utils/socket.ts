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
  // 实例
  static instance: Socket | undefined

  constructor(url: string) {
    if (!Socket.instance) {
      this.url = url
      this.ws = new WebSocket(url)
      this.monitor()
      this.timerId = setInterval(() => {
        if (this.ws !== null) {
          this.send('heartBeat')
        }
      }, this.timeOut)
      Socket.instance = this
    }
    return Socket.instance
  }
  monitor(): void {
    const { ws } = this
    ws!.onopen = () => {
      console.log('ws连接已建立')
    }
    ws!.onmessage = ({ data }) => {
      const { data: content, type } = JSON.parse(data)
      this.handleType(type, content)
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
  handleType(type: string, data?: any): void {
    switch (type) {
      default: {
        this.exeEvent(type, data)
      }
    }
  }
  send(type: string, data?: any): void {
    this.ws?.send(JSON.stringify({ type, data }))
  }
  subscribeEvent(type: string, callback: Function): void {
    const eventList: Function[] | undefined = this.events[type]
    if (eventList === undefined) {
      this.events[type] = [callback]
    } else {
      this.events[type].push(callback)
    }
  }
  exeEvent(type: string, data: any): void {
    const eventList: Function[] | undefined = this.events[type]
    if (eventList !== undefined) {
      eventList.forEach((fn: Function) => fn(data))
    }
  }
}