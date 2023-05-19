export type WorldUsersState = Record<
  string,
  {
    connectedUsers: Set<string>
    lastMessageSent: number
  }
>

export let worldStateObj: WorldUsersState = {}

export const removeUserFromWorldState = (worldId: string, userId: string) => {
  worldStateObj[worldId].connectedUsers.delete(userId)
  return worldStateObj
}

export const clearWorldFromWorldState = (worldId: string) => {
  delete worldStateObj[worldId]
  return worldStateObj
}

export const clearWorldState = () => {
  Object.keys(worldStateObj).map((worldStateKey) => delete worldStateObj[worldStateKey])
  return worldStateObj
}

export const clearWorldStateKeysOlderThanMs = (latestUpdate: number) => {
  Object.keys(worldStateObj).map((worldStateKey) => {
    if (worldStateObj[worldStateKey].lastMessageSent < latestUpdate) {
      delete worldStateObj[worldStateKey]
    }
  })
}
