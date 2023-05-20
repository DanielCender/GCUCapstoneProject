import { IModel } from './Models'

export namespace Contracts {
  export namespace GetWorlds {
    export interface GetWorldsItem extends IModel {
      worldName: string
      ownerId: string
      ownerName: string
      worldHasPassword: boolean
    }
    export type GetWorldsResponse = GetWorldsItem[]
  }
  export namespace GetWorldMessages {
    export interface MessageItem extends IModel {
      text: string
      authorId: string
      authorName: string
      createdAt: string
    }
    export type GetWorldMessagesResponse = MessageItem[]
  }
}
