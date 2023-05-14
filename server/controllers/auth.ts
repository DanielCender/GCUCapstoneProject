import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { APP_CONFIG } from '../config'
import { db } from '../boundaries/db'

const environment = APP_CONFIG()
const AUTH_COOKIE = 'littleOfficesAuth'

const signCookieForUser = (username: string, signature: string) => {
  return JSON.stringify(
    jwt.sign(
      { username, iat: Date.now(), exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
      signature
    )
  )
}

const authRouter = express.Router()

authRouter.post(
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
      const queryRes = await db.query(text, values)
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

authRouter.post(
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
      const queryRes = await db.query(usernameCheckQuery, usernameCheckValues)

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
        const signupRes = await db.query(userInsertQuery, userInsertValues)

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

export { authRouter }
