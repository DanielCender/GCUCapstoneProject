import { WebSocketMessages, WSMessage, WSMessageType } from '../../../types/Messages'
import { db } from '../db'

export type MessageProcessingResultStatus = {
  status: number
  message: string
}

const messageReducer = async (message: WSMessage): Promise<MessageProcessingResultStatus> => {
  switch (message.type) {
    case WSMessageType.UserJoined: {
      // todo: handle user joined, create world user
      break
    }
    case WSMessageType.UserLeft: {
      // todo: handle user left, remove from server state
      break
    }
    case WSMessageType.ChatMessageSent: {
      // todo: Create new worldMessage record in db, publish message to clients
      break
    }
    default:
      // todo: unsupported message
      console.warn(
        `Received unsupported message type ${
          message.type
        }: Unable to process contents ${JSON.stringify(message.body)}`
      )
  }

  return {
    status: 200,
    message: 'Message processed successfully',
  }
}

export { messageReducer }
