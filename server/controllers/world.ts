import express from 'express'
import { db } from '../boundaries/db'

const worldDataRouter = express.Router()

worldDataRouter.post(
  '/users/:userId/worlds',
  authenticateToken,
  async (
    req: {
      cookies: any
      params: { userId: string }
      body: { worldname: string; worldpassword: string }
    },
    res
  ) => {
    console.log('req.body', req.body)
    console.log('req.params', req.params)

    const { worldname, worldpassword } = req.body
    const { userId } = req.params

    // validation
    if (!worldname || worldname.length < 6) {
      res
        .status(422)
        .send({ message: 'Need to specify a world name of at least 6 characters long' })
      return
    }

    if (worldpassword && worldpassword.length < 8) {
      res.status(422).send({ message: 'World password must be at least 8 characters long' })
      return
    }

    // Check for any matching usernames
    try {
      const worldnameCheckQuery = 'SELECT * FROM worlds WHERE name LIKE $1 AND ownerId = $2'
      const worldnameCheckValues = [`%${worldname}%`, userId]
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
    const worldInsertValues = [worldname, worldpassword, userId]
    try {
      const worldCreateRes = await db.query(worldInsertQuery, worldInsertValues)
      console.log(worldCreateRes.rows[0])
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

worldDataRouter.get(
  '/users/:userId/worlds',
  async (req: { cookies: any; params: { userId: string } }, res) => {
    const { userId } = req.params
    // Check for any matching usernames
    try {
      const worldQuery = 'SELECT * FROM worlds WHERE ownerId = $1'
      const worldQueryValues = [userId]
      const queryRes = await db.query(worldQuery, worldQueryValues)

      res.status(200).send(queryRes.rows)
    } catch (err: any) {
      console.log(err.stack)
      res.status(500).send({ message: 'Server error encountered' })
      return
    }
  }
)

worldDataRouter.delete(
  '/users/:userId/worlds/:worldId',
  async (req: { cookies: any; params: { userId: string; worldId: string } }, res) => {
    console.log('req.params', req.params)

    const { userId, worldId } = req.params

    // Check for any matching worlds by these params
    try {
      const worldQuery = 'SELECT * FROM worlds WHERE ownerId = $1 AND id = $2'
      const worldQueryValues = [userId, worldId]
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
