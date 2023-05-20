import jwt from 'jsonwebtoken'
import { APP_CONFIG } from '../config/index'
import { JWTTokenPayload } from '../../types/Auth'
import { NextFunction, Request, Response } from 'express'

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  jwt.verify(token, APP_CONFIG().JWT_SIGNATURE, (err: any, tokenPayload: JWTTokenPayload) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.authedUserId = tokenPayload.userId
    next()
  })
}

export { authenticateToken }
