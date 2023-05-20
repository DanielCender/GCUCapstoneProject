// todo: Unused, need to implement avatar selection preferences table and routes, etc.
export const USER_AVATAR_OPTIONS = [
  'henry',
  'pam',
  'alexandra',
  'bill',
  'hermione',
  'harry',
] as const

export type UserAvatar = typeof USER_AVATAR_OPTIONS[number]
