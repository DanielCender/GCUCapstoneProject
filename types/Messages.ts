export enum Message {
  UPDATE_PLAYER,
  READY_TO_CONNECT,
  CONNECT_TO_WHITEBOARD,
  DISCONNECT_FROM_WHITEBOARD,
  ADD_CHAT_MESSAGE,
  SEND_ROOM_DATA,
}

export interface WSMessageBody {
  worldId: string
}

export type WSMessage = {
  type: string
  body: WSMessageBody // JSON body
}

export const enum ServerSentWSMessageType {
  UserJoined = 'user-joined',
  ChatMessageSent = 'chat-message-sent',
  UserLeft = 'user-left',
}

export const enum WSMessageType {
  JoinWorld = 'join-world',
  LeaveWorld = 'leave-world',
}

export namespace WebSocketMessages {
  export interface UserJoinedMessage extends WSMessage {
    type: ServerSentWSMessageType.UserJoined
    body: {
      worldId: string
      userId: string
      username: string
      avatar: string
    }
  }

  export interface UserLeftMessage extends WSMessage {
    type: ServerSentWSMessageType.UserLeft
    body: {
      worldId: string
      userId: string
      username: string
    }
  }

  export interface ChatMessageSentMessage extends WSMessage {
    type: ServerSentWSMessageType.ChatMessageSent
    body: {
      worldId: string
      userId: string
      username: string
      avatar: string
      text: string
    }
  }
}

// type ObjectString = String
// export namespace WSMessages {
//   interface Message {
//     type: string
//     body: ObjectString // JSON body
//   }

//   interface UserJoinedMessage extends Message {
//     type: 'user-joined'
//     body: {}
//   }
// }
