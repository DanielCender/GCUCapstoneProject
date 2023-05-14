import WebSocket from 'ws'
import { WebSocketServer } from './../boundaries/../../boundaries/websockets'

function startServer(callback: VoidFunction) {
  const server = new WebSocketServer(8080)

  server.on('listening', () => {
    callback()
  })

  return server
}

function stopServer(server: WebSocket.Server) {
  server.close(() => {
    console.log('WebSocket server stopped')
  })
}

export { startServer, stopServer }
