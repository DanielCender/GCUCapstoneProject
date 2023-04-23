export enum RoomType {
    LOBBY = 'lobby',
    // PUBLIC = 'public',
    CUSTOM = 'custom',
    PROTECTED = 'protected',
  }

  export interface IRoomData {
    name: string
    owner: string;
    password: string | null
  }