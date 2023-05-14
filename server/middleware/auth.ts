import jwt from 'jsonwebtoken'
import { APP_CONFIG } from '../config/index'
import { JWTTokenPayload } from '../../types/Auth'

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  jwt.verify(token, APP_CONFIG().JWT_SIGNATURE, (err, tokenPayload: JWTTokenPayload) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.authedUserId = tokenPayload.userId
    next()
  })
}

export { authenticateToken }
