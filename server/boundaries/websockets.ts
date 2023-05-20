import WebSocket from 'ws'
import { parseBufferToMessage, parseMessageToBuffer } from './helpers/parseMessage'
import { decodeAuthToken } from './helpers/authTokenDecode'
import {
  ClientSentWSMessageType,
  ClientWSMessage,
  ServerSentWSMessageType,
  WebSocketMessages,
} from '../../types/Messages'
import { removeUserFromWorldState, worldStateObj } from '../state/worldStateObj'
import { db } from './db'

type MessageProcessingResultStatus = {
  status: number
  message: string
}

class WebSocketServer {
  public server: WebSocket.Server
  public port: number
  public clients: Record<string, Set<WebSocket>>

  constructor(port: number) {
    this.server = new WebSocket.Server({ port })
    this.port = port
    this.clients = {}
    this.server.on('connection', this.handleConnection.bind(this))
  }

  handleConnection(socket: WebSocket) {
    socket.on('message', this.handleMessage.bind(this, socket))
    socket.on('close', this.handleClose.bind(this, socket))
    socket.on('error', this.handleError.bind(this, socket))
  }

  /**
   * @description Filters all saved clients which are associated with a worldId and sends message only to those.
   * @param worldId
   * @param messageBuffer {Buffer}
   */
  sendMessageToSameWorldClients(worldId: string, messageBuffer: Buffer): void {
    if (worldStateObj[worldId]) {
      const applicableUserClients = worldStateObj[worldId].connectedUsers
      this.server.clients.forEach((client) => {
        if (applicableUserClients.has((client as any).clientId)) {
          client.send(messageBuffer)
        }
      })
    }
  }

  logConnectionCount() {
    console.info('Now has ', this.clients.length, ' connected to the WS Server')
  }

  async handleMessage(socket: WebSocket, message: Buffer) {
    try {
      console.log('*** socket client id in handleMessage ', (socket as any).clientId)
      const msg: ClientWSMessage | null = parseBufferToMessage(message)
      if (!msg) {
        console.error('Could not process message, exiting...')
        return
      }

      console.log(`Received message from socket: ${JSON.stringify(msg)}`)
      const decodedAuthHeader = await decodeAuthToken(msg.body.authJwt)
      console.log('decoded auth header: ', decodedAuthHeader)
      const userId = decodedAuthHeader.userId

      //   const resultMessage = await messageReducer(this, socket, msg, decodedAuthHeader.userId)
      let resultMessage: MessageProcessingResultStatus = {
        status: 200,
        message: 'Message processed successfully',
      }

      switch (msg.type) {
        case ClientSentWSMessageType.JoinWorld: {
          const { worldId } = (msg as WebSocketMessages.JoinWorldMessage).body
          if (!worldStateObj[worldId].connectedUsers.has(userId)) {
            throw new Error('User not found in world state. Please try to re-join the server')
          }
          ;(socket as any).clientId = userId
          if (this.clients[worldId]) {
            this.clients[worldId].add(socket)
          } else {
            this.clients[worldId] = new Set([socket])
          }
          this.logConnectionCount()

          // * Filter saved socket clients and pass along the server-side message announcing the new user
          const messageBuffer = parseMessageToBuffer({
            type: ServerSentWSMessageType.UserJoined,
            body: {
              userId,
              username: decodedAuthHeader.username,
            },
          })
          if (messageBuffer) {
            this.sendMessageToSameWorldClients(worldId, messageBuffer)
          }
          break
        }
        case ClientSentWSMessageType.LeaveWorld: {
          const { worldId } = (msg as WebSocketMessages.LeaveWorldMessage).body
          removeUserFromWorldState(worldId, userId)
          if (this.clients[worldId]) {
            this.clients[worldId].delete(socket)
          }
          this.logConnectionCount()

          const messageBuffer = parseMessageToBuffer({
            type: ServerSentWSMessageType.UserLeft,
            body: {
              userId,
              username: decodedAuthHeader.username,
            },
          })
          if (messageBuffer) {
            this.sendMessageToSameWorldClients(worldId, messageBuffer)
          }
          break
        }
        case ClientSentWSMessageType.SendChatMessage: {
          const { worldId, text } = (msg as WebSocketMessages.SendChatMessage).body
          // todo: Make db call

          let created_at = Date.now()
          // * Begin: DB Call
          const messageInsertQuery =
            'INSERT INTO worldMessages(text, authorId, worldId, created_at) VALUES($1, $2, $3, NOW()) RETURNING *'
          const messageInsertValues = [text, userId, worldId]
          try {
            const worldCreateRes = await db.query(messageInsertQuery, messageInsertValues)
            console.info('finished createing new worldMessages row: ', worldCreateRes.rows[0])
            created_at = worldCreateRes.rows[0].created_at
          } catch (err: any) {
            console.log(err.stack)
          }
          // * End: DB Call

          // * Filter saved socket clients and pass along the server-side message announcing the new user
          const messageBuffer = parseMessageToBuffer({
            type: ServerSentWSMessageType.ChatMessageSent,
            body: {
              userId,
              username: decodedAuthHeader.username,
              text,
              created_at,
            },
          })
          if (messageBuffer) {
            this.sendMessageToSameWorldClients(worldId, messageBuffer)
          }
          break
        }
        default:
          console.warn(
            `Received unsupported message type ${
              msg.type
            }: Unable to process contents ${JSON.stringify(msg.body)}`
          )
      }

      console.info(
        'Processed message. Sending to all clients with result: ',
        JSON.stringify(resultMessage)
      )

      // Send a response back to the client
      socket.send(`Received your message: ${message}`)

      const messageBuffer = parseMessageToBuffer(resultMessage)
      if (messageBuffer) {
        this.server.clients.forEach((client) => client.send(messageBuffer))
      }
    } catch (e: any) {
      console.error('Some unhandled error occured: ', e.message)
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

  close() {
    this.server.close()
  }
}

export { WebSocketServer }
