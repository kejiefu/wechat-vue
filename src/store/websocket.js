let socket = ''
let setIntervalWebsocketPush = null
let wsUrl = 'ws://127.0.0.1:8082'

/**
 *  0     CONNECTING         连接尚未建立
 1        OPEN               WebSocket的链接已经建立
 2        CLOSING            连接正在关闭
 3        CLOSED             连接已经关闭或不可用
 * 建立websocket连接
 * @param {string} url ws地址
 */
export const createSocket = url => {
  socket && socket.close()
  if (!socket) {
    console.log('建立websocket连接')
    socket = new WebSocket(wsUrl)
    socket.onopen = onopenWs
    socket.onmessage = onmessageWs
    socket.onerror = onerrorWs
    socket.onclose = oncloseWs
    console.log('createSocket.readyState:' + socket.readyState)
  } else {
    console.log('websocket已连接')
  }
}

/** 打开WS之后发送心跳 */
const onopenWs = () => {
  console.log('onopenWs.socket:' + socket.readyState)
  sendPing()
}

/** 连接失败重连 */
const onerrorWs = () => {
  socket.close()
  clearInterval(setIntervalWebsocketPush)
  console.log('连接失败重连中')
  if (socket.readyState !== 3) {
    socket = null
    createSocket(wsUrl)
  }
}

/** WS数据接收统一处理 */
const onmessageWs = e => {
  window.dispatchEvent(new CustomEvent('onmessageWS', {
    detail: {
      data: e.data
    }
  }))
}

/**
 * 发送数据但连接未建立时进行处理等待重发
 * @param {any} message 需要发送的数据
 */
const connecting = message => {
  setTimeout(() => {
    if (socket.readyState === 0) {
      connecting(message)
    } else {
      socket.send(JSON.stringify(message))
    }
  }, 1000)
}

/**
 * 发送数据
 * @param {any} message 需要发送的数据
 */
export const sendWsPush = message => {
  console.log('sendWsPush...')
  console.log(socket.readyState)
  if (socket !== null && socket.readyState === 3) {
    socket.close()
    createSocket(wsUrl)
  } else if (socket.readyState === 1) {
    console.log('发送消息：' + message)
    socket.send(JSON.stringify(message))
  } else if (socket.readyState === 0) {
    connecting(message)
  }
}

/** 断开重连 */
const oncloseWs = () => {
  clearInterval(setIntervalWebsocketPush)
  console.log('websocket已断开....正在尝试重连')
  console.log('oncloseWs：' + socket.readyState, WebSocket.OPEN)
  if (socket.readyState !== WebSocket.OPEN) {
    socket = null
    createSocket(wsUrl)
  }
}
/** 发送心跳
 * @param {number} time 心跳间隔毫秒 默认5000
 * @param {string} ping 心跳名称 默认字符串ping
 */
export const sendPing = (time = 5000, ping = 'ping') => {
  clearInterval(setIntervalWebsocketPush)
  socket.send(ping)
  setIntervalWebsocketPush = setInterval(() => {
    console.log('ping......')
    socket.send(ping)
  }, time)
}
