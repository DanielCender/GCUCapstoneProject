import { Contracts } from './Contracts'

export enum Message {
  UPDATE_PLAYER,
  READY_TO_CONNECT,
  CONNECT_TO_WHITEBOARD,
  DISCONNECT_FROM_WHITEBOARD,
  ADD_CHAT_MESSAGE,
  SEND_ROOM_DATA,
}

export const enum ServerSentWSMessageType {
  UserJoined = 'user-joined',
  ChatMessageSent = 'chat-message-sent',
  UserLeft = 'user-left',
}

export const enum ClientSentWSMessageType {
  JoinWorld = 'join-world',
  SendChatMessage = 'send-chat-message',
  LeaveWorld = 'leave-world',
}

export interface WSClientMessageBody {
  authJwt: string
  worldId: string
}

export interface ServerWSMessage {
  type: ServerSentWSMessageType
  body: object // JSON body
}

export type ClientWSMessage = {
  type: ClientSentWSMessageType
  body: WSClientMessageBody
}

export namespace WebSocketMessages {
  export interface UserJoinedMessage extends ServerWSMessage {
    type: ServerSentWSMessageType.UserJoined
    body: {
      userId: string
      username: string
    }
  }

  export interface UserLeftMessage extends ServerWSMessage {
    type: ServerSentWSMessageType.UserLeft
    body: {
      userId: string
      username: string
    }
  }

  export interface ChatMessageSentMessage extends ServerWSMessage {
    type: ServerSentWSMessageType.ChatMessageSent
    body: Contracts.GetWorldMessages.MessageItem
  }

  export interface JoinWorldMessage extends ClientWSMessage {
    type: ClientSentWSMessageType.JoinWorld
    body: {
      authJwt: string
      worldId: string
    }
  }

  export interface LeaveWorldMessage extends ClientWSMessage {
    type: ClientSentWSMessageType.LeaveWorld
    body: {
      authJwt: string
      worldId: string
    }
  }

  export interface SendChatMessage extends ClientWSMessage {
    type: ClientSentWSMessageType.SendChatMessage
    body: {
      authJwt: string
      worldId: string
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
