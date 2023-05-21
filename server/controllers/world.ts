import express, { Request } from 'express'
import { Contracts } from '../../types/Contracts'
import { db } from '../boundaries/db'
import { authenticateToken } from '../middleware'
import { addUserToWorldState, worldStateObj } from '../state/worldStateObj'

const worldHasPasscode = async (worldId: string): Promise<boolean> => {
  try {
    const worldCheckQuery = 'SELECT * FROM worlds WHERE id = $1'
    const worldCheckValues = [worldId]
    const queryRes = await db.query(worldCheckQuery, worldCheckValues)
    if (queryRes.rows.length !== 1) {
      return false
    }

    return !!queryRes.rows[0]?.password
  } catch (err: any) {
    console.log(err.stack)
    return false
  }
}

const worldDataRouter = express.Router()

worldDataRouter.post(
  '/worlds',
  authenticateToken,
  async (
    req: Request<
      {},
      { message: string; name?: string },
      { worldname: string; worldPassword: string }
    >,
    res
  ) => {
    const { authedUserId } = req
    const { worldname, worldPassword } = req.body

    // validation
    if (!worldname || worldname.length < 6) {
      res
        .status(422)
        .send({ message: 'Need to specify a world name of at least 6 characters long' })
      return
    }

    if (worldPassword && worldPassword.length < 8) {
      res.status(422).send({ message: 'World password must be at least 8 characters long' })
      return
    }

    // Check for any matching usernames
    try {
      const worldnameCheckQuery = 'SELECT * FROM worlds WHERE name LIKE $1 AND ownerId = $2'
      const worldnameCheckValues = [`%${worldname}%`, authedUserId]
      const queryRes = await db.query(worldnameCheckQuery, worldnameCheckValues)

      if (queryRes.rows.length > 0) {
        res.status(422).send({ message: 'Owner already has a world by that name, sorry!' })
        return
      }
    } catch (err: any) {
      console.log(err.stack)
      res.status(500).send({ message: 'Server error encountered' })
      return
    }

    const worldInsertQuery =
      'INSERT INTO worlds(name, password, ownerId) VALUES($1, $2, $3) RETURNING *'
    const worldInsertValues = [worldname, worldPassword, authedUserId]
    try {
      const worldCreateRes = await db.query(worldInsertQuery, worldInsertValues)
      if (worldCreateRes.rows[0].name === worldname) {
        res.status(200).send({ message: 'World created!', name: worldname })
      } else {
        res.status(500).send({ message: 'Issue with processing creation request' })
      }
    } catch (err: any) {
      console.log(err.stack)
    }
  }
)

worldDataRouter.post(
  '/worlds/join',
  authenticateToken,
  async (
    req: Request<
      {},
      { message: string; worldId?: string; worldName?: string },
      { worldId: string; worldPassword?: string }
    >,
    res
  ) => {
    const { authedUserId } = req
    const { worldId, worldPassword } = req.body
    let worldName = ''
    // validation
    if (!worldId) {
      res.status(422).send({ message: 'Need to specify a world ID to join' })
      return
    }

    // Check for any matching worlds, including password
    try {
      const worldCheckQuery = 'SELECT * FROM worlds WHERE id = $1'
      const worldCheckValues = [worldId]
      const queryRes = await db.query(worldCheckQuery, worldCheckValues)
      if (queryRes.rows.length !== 1) {
        res.status(422).send({ message: 'Cannot find a world with that ID, sorry!' })
        return
      }

      if (queryRes.rows[0]?.password) {
        if (worldPassword !== queryRes.rows[0]?.password) {
          res.status(422).send({ message: 'Invalid world passcode!' })
          return
        }
      }

      worldName = queryRes.rows[0].name
    } catch (err: any) {
      console.log(err.stack)
      res.status(500).send({ message: 'Server error encountered' })
      return
    }

    // Prep world state to include this world and authorized user
    if (worldStateObj[worldId]) {
      addUserToWorldState(worldId, authedUserId)
    } else {
      worldStateObj[worldId] = {
        connectedUsers: new Set([authedUserId]),
        lastMessageSent: Date.now(),
      }
    }
    res.status(200).send({ message: 'Successfully connected to world state!', worldId, worldName })
  }
)

worldDataRouter.get(
  '/worlds',
  authenticateToken,
  async (req: Request<{}, Contracts.GetWorlds.GetWorldsResponse>, res) => {
    const { authedUserId } = req
    try {
      // * Get owned worlds
      const worldQuery =
        'SELECT worlds.id as worldId, worlds.name as worldName, worlds."password", users.id as ownerId, users.username as ownerName FROM worlds JOIN users ON worlds.ownerId = users.id WHERE ownerId = $1'
      const worldQueryValues = [authedUserId]
      const queryRes = await db.query(worldQuery, worldQueryValues)

      const ownedWorlds: Contracts.GetWorlds.GetWorldsResponse = queryRes.rows.map((row: any) => ({
        id: row.worldid,
        worldName: row.worldname,
        worldHasPassword: !!row.password,
        ownerId: row.ownerid,
        ownerName: row.ownername,
      }))

      // * Get attended worlds
      const worldUsersQuery =
        'SELECT worldusers.worldId from worldusers where worldusers.userId = $1'
      const worldUsersQueryValues = [authedUserId]
      const worldUsersQueryRes = await db.query(worldUsersQuery, worldUsersQueryValues)

      const attendedWorldsQuery =
        'SELECT worlds.id as worldId, worlds.name as worldName, worlds."password", users.id as ownerId, users.username as ownerName FROM worlds JOIN users ON worlds.ownerId = users.id WHERE worlds.id = ANY($1::int[])'
      const attendedWorldsQueryValues = [worldUsersQueryRes.rows.map((row: any) => row.worldId)]
      const attendedWorldsQueryRes = await db.query(attendedWorldsQuery, attendedWorldsQueryValues)

      const attendedWorlds: Contracts.GetWorlds.GetWorldsResponse = attendedWorldsQueryRes.rows.map(
        (row: any) => ({
          id: row.worldid,
          worldName: row.worldname,
          worldHasPassword: !!row.password,
          ownerId: row.ownerid,
          ownerName: row.ownername,
        })
      )

      res.status(200).send([...ownedWorlds, ...attendedWorlds])
    } catch (err: any) {
      console.log(err.stack)
      res.status(500).send([])
      return
    }
  }
)

worldDataRouter.get(
  '/worlds/:worldId/messages',
  authenticateToken,
  async (
    req: Request<{ worldId: string }, Contracts.GetWorldMessages.GetWorldMessagesResponse>,
    res
  ) => {
    const {
      authedUserId,
      params: { worldId },
    } = req

    const hasPasscode = await worldHasPasscode(worldId)
    if (hasPasscode) {
      // * We can presume the user would have already "joined" the world prior to querying
      // *  this route. If they aren't in the valid world state user list, then we can't guarantee
      // *  they passed the world passcode check
      if (!worldStateObj[worldId]?.connectedUsers.has(authedUserId)) {
        console.error(
          `User ${authedUserId} just attempted to illegally access world ${worldId}'s messages`
        )
        res.status(500).send([])
        return
      }
    }

    try {
      // * Get all world messages
      const worldQuery =
        'SELECT worldMessages.id, worldMessages.worldId as worldId, worldMessages.text, worldMessages.createdAt, worldMessages.authorId, users.username as authorName FROM worldMessages JOIN users ON worldMessages.authorId = users.id WHERE worldMessages.worldId = $1'
      const worldQueryValues = [worldId]
      const queryRes = await db.query(worldQuery, worldQueryValues)

      const worldMessages: Contracts.GetWorldMessages.GetWorldMessagesResponse = queryRes.rows.map(
        (row: any) => ({
          id: row.id,
          text: row.text,
          authorId: row.authorid,
          authorName: row.authorname,
          createdAt: row.createdat,
        })
      )

      res.status(200).send(worldMessages)
    } catch (err: any) {
      console.log(err.stack)
      res.status(500).send([])
      return
    }
  }
)

worldDataRouter.delete(
  '/worlds/:worldId',
  authenticateToken,
  async (req: Request<{ worldId: string }>, res) => {
    const { authedUserId } = req
    const { worldId } = req.params

    // Check for any matching worlds by these params
    try {
      const worldQuery =
        'SELECT * FROM worlds JOIN users ON worlds.ownerId = users.id WHERE worlds.ownerId = $1 AND worlds.id = $2'
      const worldQueryValues = [authedUserId, worldId]
      const queryRes = await db.query(worldQuery, worldQueryValues)

      if (queryRes.rows.length !== 1) {
        res.status(500).send({ message: 'No existing world found for those parameters' })
        return
      }
    } catch (err: any) {
      console.log(err.stack)
      res.status(500).send({ message: 'Server error encountered' })
      return
    }

    // Check for any matching worlds
    try {
      const worldQuery = 'DELETE FROM worlds WHERE id = $1'
      const worldQueryValues = [worldId]
      const queryRes = await db.query(worldQuery, worldQueryValues)
      if (queryRes.rowCount === 1) {
        res.status(200).send({ message: 'Successfully deleted world!' })
      } else {
        res.status(500).send({ message: 'Unknown issue occured' })
      }
    } catch (err: any) {
      console.log(err.stack)
      res.status(500).send({ message: 'Server error encountered' })
      return
    }
  }
)

export { worldDataRouter }
