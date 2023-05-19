import { WebSocketMessages, WSMessage, ServerSentWSMessageType } from '../../../types/Messages'
import { worldStateObj, removeUserFromWorldState } from '../../state/worldStateObj'
import { db } from '../db'

export type MessageProcessingResultStatus = {
  status: number
  message: string
}

const messageReducer = async (message: WSMessage): Promise<MessageProcessingResultStatus> => {
  switch (message.type) {
    case ServerSentWSMessageType.UserJoined: {
      const { worldId, userId } = (message as WebSocketMessages.UserJoinedMessage).body
      removeUserFromWorldState(worldId, userId)
      break
    }
    case ServerSentWSMessageType.UserLeft: {
      const { worldId, userId } = (message as WebSocketMessages.UserLeftMessage).body
      removeUserFromWorldState(worldId, userId)
      break
    }
    case ServerSentWSMessageType.ChatMessageSent: {
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
