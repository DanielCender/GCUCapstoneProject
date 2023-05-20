import WebSocket from 'ws'
import { messageReducer } from './helpers/messageReducer'
import { parseBufferToMessage, parseMessageToBuffer } from './helpers/parseMessage'
import { decodeAuthToken } from './helpers/authTokenDecode'
import { ClientWSMessage } from '../../types/Messages'

class AbstractWebSocketServer {
  public server: WebSocket.Server
  public port: number
  public clients: Record<string, Set<WebSocket>>

  constructor(port: number) {
    this.server = new WebSocket.Server({ port })
    this.port = port
    this.server.on('connection', this.handleConnection.bind(this))
  }

  handleConnection(socket: WebSocket) {
    socket.on('message', this.handleMessage.bind(this, socket))
    socket.on('close', this.handleClose.bind(this, socket))
    socket.on('error', this.handleError.bind(this, socket))
  }

  async handleMessage(socket: WebSocket, message: Buffer) {
    // Override this method in a subclass to handle incoming messages
  }

  handleClose(socket: WebSocket, code: number, reason: string) {
    // Override this method in a subclass to handle socket close events
  }

  handleError(socket: WebSocket, error: Error) {
    // Override this method in a subclass to handle socket error events
  }

  close() {
    this.server.close()
  }
}

class WebSocketServer extends AbstractWebSocketServer {
  async handleMessage(socket: WebSocket, message: Buffer) {
    const msg: ClientWSMessage | null = parseBufferToMessage(message)
    if (!msg) {
      console.error('Could not process message, exiting...')
    }

    console.log(`Received message from socket: ${JSON.stringify(msg)}`)
    const decodedAuthHeader = await decodeAuthToken(msg.body.authJwt)
    console.log('decoded auth header: ', decodedAuthHeader)
    const resultMessage = await messageReducer(decodedAuthHeader.userId, msg)
    console.info(
      'Processed message. Sending to all clients with result: ',
      JSON.stringify(resultMessage)
    )

    // Send a response back to the client
    // socket.clients.forEach(client => client.send)
    socket.send(`Received your message: ${message}`)

    const messageBuffer = parseMessageToBuffer(resultMessage)
    if (messageBuffer) {
      this.server.clients.forEach((client) => client.send(messageBuffer))
    }
  }

  handleClose(socket: WebSocket, code: number, reason: string) {
    // Handle the socket close event here
    console.log(`Socket ${socket} closed with code ${code} and reason ${reason}`)
  }

  handleError(socket: WebSocket, error: Error) {
    // Handle the socket error event here
    console.log(`Error on socket ${socket}: ${error.message}`)
  }
}

export { WebSocketServer }
