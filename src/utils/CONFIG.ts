export default {
  WS_URL: 'ws://106.12.123.56:8088/chat',
  WS_TYPE: {
    quickStart: 0,// 快速开始
    createRoom: 1,// 创建房间
    roomsList: 2,// 房间列表
    sendInfo: 3,// 发送信息
    sendCanvas: 4,// 发送画布
    joinInMiddle: 202, // 中途玩家加入时获取的房间信息
    getStateInMiddle: 203, // 中途玩家加入时获取的房间状态
    enterRoom: 5,// 进入房间
    nextPlayer: 6,// 下一轮玩家
    chooseQuestion: 7,// 玩家选题,获取玩家选择的绘画物品,倒计时 30s
    end: 8, // 结束当前轮
    zanOrCai: 9, // 评分，点赞/点踩
    onlineNum: 10, // 发送在线人数
    verifyPwd: 11, // 发送房间密码
    quitRoom: 12, // 退出房间
    clearCanvas: 13, // 清除画布
    repealCanvas: 14, // 画布回退
    waitChooseQuestion: 100, // 其他人等待玩家选题，倒计时 30s
    waitDrawing: 101, // 玩家绘画/其他人查看玩家绘画，倒计时 120s
    evaluate: 102, // 中场暂停 倒计时 10s。以下几种情况视为中场暂停：当前绘画结束，答案已公布，玩家点赞或点踩的时间。
    waitGiveUp: 103, // 玩家放弃出题，倒计时 10s。由于玩家放弃出题，自动轮换到下一个玩家的过渡时间。
    waitPlayer: 104, // 等待玩家进入
    receivePlayerPoint: 105, // 接收玩家新的分数
    publishAnswer: 106, // 公布答案
    endOfGame: -1, // 查看玩家排名，倒计时30s
  }
}