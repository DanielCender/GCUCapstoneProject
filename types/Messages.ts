export enum Message {
  UPDATE_PLAYER,
  READY_TO_CONNECT,
  CONNECT_TO_WHITEBOARD,
  DISCONNECT_FROM_WHITEBOARD,
  ADD_CHAT_MESSAGE,
  SEND_ROOM_DATA,
}

export type WSMessage = {
  type: string
  body: object // JSON body
}

export const enum WSMessageType {
  UserJoined = 'user-joined',
  ChatMessageSent = 'chat-message-sent',
  UserLeft = 'user-left',
}

export namespace WebSocketMessages {
  export interface UserJoinedMessage extends WSMessage {
    type: WSMessageType.UserJoined
    body: {
      userId: string
      username: string
      avatar: string
    }
  }

  export interface UserLeftMessage extends WSMessage {
    type: WSMessageType.UserLeft
    body: {
      userId: string
      username: string
    }
  }

  export interface ChatMessageSentMessage extends WSMessage {
    type: WSMessageType.ChatMessageSent
    body: {
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
