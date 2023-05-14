export const USER_AVATAR_OPTIONS = [
  'henry',
  'pam',
  'alexandra',
  'bill',
  'hermione',
  'harry',
] as const

export type UserAvatar = typeof USER_AVATAR_OPTIONS[number]

// * Common fields on all models
interface IModel {
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
  }
  export interface WorldUser extends IModel {
    userId: string
    worldId: string
    avatarChoice: UserAvatar
  }
}
