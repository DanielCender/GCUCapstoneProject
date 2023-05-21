import WebSocket from 'ws'
import { parseBufferToMessage, parseMessageToBuffer } from './helpers/parseMessage'
import { decodeAuthToken } from './helpers/authTokenDecode'
import {
  ClientSentWSMessageType,
  ClientWSMessage,
  ServerSentWSMessageType,
  ServerWSMessage,
  WebSocketMessages,
} from '../../types/Messages'
import { removeUserFromWorldState, worldStateObj } from '../state/worldStateObj'
import { db } from './db'

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
   * @param msgString {JSON string}
   */
  sendMessageToSameWorldClients(worldId: string, msgString: string): void {
    if (worldStateObj[worldId]) {
      const applicableUserClients = worldStateObj[worldId].connectedUsers
      this.server.clients.forEach((client) => {
        if (applicableUserClients.has((client as any).clientId)) {
          client.send(msgString)
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
      let resultMessage: ServerWSMessage

      switch (msg.type) {
        case ClientSentWSMessageType.JoinWorld: {
          const { worldId } = (msg as WebSocketMessages.JoinWorldMessage).body

          // * Don't reject users if they didn't hit the /join route first, just add them to state
          // todo: Should fix this to return a different message type which the UI can handle and display to user
          ;(socket as any).clientId = userId
          if (this.clients[worldId]) {
            this.clients[worldId].add(socket)
          } else {
            this.clients[worldId] = new Set([socket])
          }
          this.logConnectionCount()

          // * Filter saved socket clients and pass along the server-side message announcing the new user
          resultMessage = {
            type: ServerSentWSMessageType.UserJoined,
            body: {
              id: userId,
              username: decodedAuthHeader.username,
            },
          }
          this.sendMessageToSameWorldClients(worldId, JSON.stringify(resultMessage))
          break
        }
        case ClientSentWSMessageType.LeaveWorld: {
          const { worldId } = (msg as WebSocketMessages.LeaveWorldMessage).body
          removeUserFromWorldState(worldId, userId)
          if (this.clients[worldId]) {
            this.clients[worldId].delete(socket)
          }
          this.logConnectionCount()

          resultMessage = {
            type: ServerSentWSMessageType.UserLeft,
            body: {
              id: userId,
              username: decodedAuthHeader.username,
            },
          }
          this.sendMessageToSameWorldClients(worldId, JSON.stringify(resultMessage))
          break
        }
        case ClientSentWSMessageType.SendChatMessage: {
          const { worldId, text } = (msg as WebSocketMessages.SendChatMessage).body

          let createdAt = Date.now()
          // * Begin: DB Call
          const messageInsertQuery =
            'INSERT INTO worldMessages(text, authorId, worldId, createdAt) VALUES($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *'
          const messageInsertValues = [text, userId, worldId]
          try {
            const messageCreateRes = await db.query(messageInsertQuery, messageInsertValues)
            createdAt = messageCreateRes.rows[0].createdat
          } catch (err: any) {
            console.log(err.stack)
          }
          // * End: DB Call

          // * Filter saved socket clients and pass along the server-side message announcing the new user
          resultMessage = {
            type: ServerSentWSMessageType.ChatMessageSent,
            body: {
              authorId: userId,
              authorName: decodedAuthHeader.username,
              text,
              createdAt,
            },
          }
          this.sendMessageToSameWorldClients(worldId, JSON.stringify(resultMessage))
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
        'Finished processing message. Posted back to all clients with result: ',
        JSON.stringify(resultMessage)
      )
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
