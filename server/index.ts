import http from 'http'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Client } from 'pg'
import { Server, LobbyRoom } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import { RoomType } from '../types/Rooms'

import { APP_CONFIG } from './config'

const environment = APP_CONFIG()

const signCookieForUser = (username: string, signature: string) => {
  return JSON.stringify(
    jwt.sign(
      { username, iat: Date.now(), exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
      signature
    )
  )
}

const client = new Client({
  connectionString: environment.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

client
  .connect()
  .then(() => console.log('connected'))
  .catch((err: Error) => console.error('connection error', err.stack))

const port = Number(process.env.PORT || 2567)
const app = express()

app.use(cors())
app.use(express.json())

// todo: Might need this middleware for cookie session auth
// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', req.headers.origin) // todo: Would need to be constrained to pre-written list for security
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
//   next()
// })

// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (allowlist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }

const AUTH_COOKIE = 'littleOfficesAuth'

app.use(cookieParser(environment.JWT_SIGNATURE))

// REST Routes
app.post(
  '/login',
  async (req: { cookies: any; body: { username: string; password: string } }, res) => {
    if (req.cookies[AUTH_COOKIE]) {
      console.log('has cookie')
      try {
        const decoded = jwt.verify(req.cookies[AUTH_COOKIE], environment.JWT_SIGNATURE)
        console.log('decoded jwt: ', JSON.stringify(decoded, null, 2))
        res.cookie(AUTH_COOKIE, signCookieForUser(req.body.username, environment.JWT_SIGNATURE), {
          maxAge: 24 * 60 * 60,
          httpOnly: false,
          sameSite: 'none',
          secure: true,
          // domain: 'localhost',
        })
        res.status(200).send({ message: 'Already logged in!' })
        return
        // renew cookie
      } catch (err: any) {
        // err - invalid or exp token
        console.log('jwt decoding err: ', JSON.stringify(err, null, 2))
      }
    }

    const { username, password } = req.body

    console.log('/login req.body', JSON.stringify(req.body, null, 2))

    const text = 'SELECT * FROM users WHERE username = $1'
    const values = [username]
    try {
      const queryRes = await client.query(text, values)
      console.log(queryRes.rows[0])

      const [userToCheck] = queryRes.rows
      const match = await bcrypt.compare(password, userToCheck?.password ?? '')

      if (match) {
        // Successful login
        // issue token valid for 24-hours
        console.log('jwt about to set: ', signCookieForUser(username, environment.JWT_SIGNATURE))
        res.cookie(AUTH_COOKIE, signCookieForUser(username, environment.JWT_SIGNATURE), {
          maxAge: 60 * 24,
        })
        res.status(200).send({ message: 'Logged in successfully!', userId: userToCheck.id })
      } else {
        res.status(401).send({ message: 'Invalid username or password!' })
      }
    } catch (err: any) {
      console.log(err.stack)
      res.status(500).send({ message: 'Server error encountered' })
    }
  }
)

app.post(
  '/signup',
  async (req: { cookies: any; body: { username: string; password: string } }, res) => {
    if (req.cookies[AUTH_COOKIE]) {
      res.status(200).send({ message: 'Already logged in!' })
      return
    }

    console.log('/signup req.body', JSON.stringify(req.body, null, 2))
    const saltRounds = 10
    const { username, password } = req.body

    if (!username || username.length < 6) {
      res.status(422).send({ message: 'Need to specify a username at least 6 characters long' })
      return
    }

    if (password.length < 8) {
      res.status(422).send({ message: 'Password must be at least 8 characters long' })
      return
    }

    // Check for any matching usernames
    try {
      const usernameCheckQuery = 'SELECT * FROM users WHERE username LIKE $1'
      const usernameCheckValues = [`%${username}%`]
      const queryRes = await client.query(usernameCheckQuery, usernameCheckValues)

      if (queryRes.rows.length > 0) {
        res.status(422).send({ message: 'Username already taken, sorry!' })
        return
      }
    } catch (err: any) {
      console.log(err.stack)
      res.status(500).send({ message: 'Server error encountered' })
      return
    }

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        res.status(500).send({ message: 'Failed to hash password, server issue' })
        return
      }

      // Store hash in your password DB.
      const userInsertQuery = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *'
      const userInsertValues = [username, hash]
      try {
        const signupRes = await client.query(userInsertQuery, userInsertValues)

        console.log(signupRes.rows[0])
        if (signupRes.rows[0].username === username) {
          res.status(200).send({ message: 'Signup completed!', username })
        } else {
          res.status(500).send({ message: 'Issue with processing signup request' })
        }
      } catch (err: any) {
        console.log(err.stack)
      }
    })
  }
)

app.post(
  '/world',
  async (
    req: { cookies: any; body: { worldname: string; worldpassword: string; ownerId: string } },
    res
  ) => {
    console.log('req.body', req.body)

    const { worldname, worldpassword, ownerId } = req.body
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
      const worldnameCheckValues = [`%${worldname}%`, ownerId]
      const queryRes = await client.query(worldnameCheckQuery, worldnameCheckValues)

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
    const worldInsertValues = [worldname, worldpassword, ownerId]
    try {
      const worldCreateRes = await client.query(worldInsertQuery, worldInsertValues)
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

app.get('/users/:userId/worlds', async (req: { cookies: any; params: { userId: string } }, res) => {
  console.log('req.params', req.params)

  const { userId } = req.params

  // Check for any matching usernames
  try {
    const worldQuery = 'SELECT * FROM worlds WHERE ownerId = $1'
    const worldQueryValues = [userId]
    const queryRes = await client.query(worldQuery, worldQueryValues)

    res.status(200).send(queryRes.rows)
  } catch (err: any) {
    console.log(err.stack)
    res.status(500).send({ message: 'Server error encountered' })
    return
  }
})

app.delete(
  '/users/:userId/worlds/:worldId',
  async (req: { cookies: any; params: { userId: string; worldId: string } }, res) => {
    console.log('req.params', req.params)

    const { userId, worldId } = req.params

    // Check for any matching worlds by these params
    try {
      const worldQuery = 'SELECT * FROM worlds WHERE ownerId = $1 AND id = $2'
      const worldQueryValues = [userId, worldId]
      const queryRes = await client.query(worldQuery, worldQueryValues)

      if (queryRes.rows.length !== 1) {
        res.status(500).send({ message: 'No existing world found for those parameters' })
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
      const queryRes = await client.query(worldQuery, worldQueryValues)
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

app.listen(3000) // for http interactions

const server = http.createServer(app)
const gameServer = new Server({
  server,
})

// register room handlers
gameServer.define(RoomType.LOBBY, LobbyRoom)

// gameServer.define(RoomType.CUSTOM, LittleOffice).enableRealtimeListing()
// gameServer.define(RoomType.PROTECTED, LittleOffice).enableRealtimeListing()

/* Maybe not the ones below */
// gameServer.define(RoomType.PUBLIC, SkyOffice, {
//   name: 'Public Lobby',
//   description: 'For making friends and familiarizing yourself with the controls',
//   password: null,
//   autoDispose: false,
// })

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/server/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

app.use('/colyseus', monitor())

gameServer.listen(port)
console.log(`Listening on ws://localhost:${port}`)
