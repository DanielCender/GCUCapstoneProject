import {
  WebSocketMessages,
  ClientWSMessage,
  ClientSentWSMessageType,
} from '../../../types/Messages'
import { removeUserFromWorldState } from '../../state/worldStateObj'

export type MessageProcessingResultStatus = {
  status: number
  message: string
}

const messageReducer = async (
  userId: string,
  message: ClientWSMessage
): Promise<MessageProcessingResultStatus> => {
  switch (message.type) {
    case ClientSentWSMessageType.JoinWorld: {
      const { worldId } = (message as WebSocketMessages.JoinWorldMessage).body
      removeUserFromWorldState(worldId, userId)
      break
    }
    case ClientSentWSMessageType.LeaveWorld: {
      const { worldId } = (message as WebSocketMessages.LeaveWorldMessage).body
      removeUserFromWorldState(worldId, userId)
      break
    }
    case ClientSentWSMessageType.SendChatMessage: {
      // todo: Make db call
      // todo: Make response shape

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
