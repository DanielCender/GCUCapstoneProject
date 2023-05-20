import jwt from 'jsonwebtoken'
import { JWTTokenPayload } from '../../../types/Auth'
import { APP_CONFIG } from '../../config/index'

export const decodeAuthToken = async (token: string): Promise<JWTTokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, APP_CONFIG().JWT_SIGNATURE, (err: any, decoded: JWTTokenPayload) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}
