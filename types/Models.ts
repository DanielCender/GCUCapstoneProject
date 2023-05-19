import { UserAvatar } from './constants'

// * Common fields on all models
export interface IModel {
  id: string
}

export namespace Models {
  export interface User extends IModel {
    username: string
    password: string
  }

  export interface World extends IModel {
    ownerId: string
    name: string
    password: string
  }
  export interface WorldMessage extends IModel {
    text: string
    worldId: string
    authorId: string
    created_at: string
  }
  export interface WorldUser extends IModel {
    userId: string
    worldId: string
    avatarChoice: UserAvatar
  }
}
