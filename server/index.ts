import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { APP_CONFIG } from './config'
import { authRouter, worldDataRouter } from './controllers'
import { WebSocketServer } from './boundaries/websockets'

const environment = APP_CONFIG()

const app = express()

app.use(cors())
app.use(express.json())

app.use(cookieParser(environment.JWT_SIGNATURE) as any)

app.use(authRouter)
app.use(worldDataRouter)

app.listen(3000) // for http interactions

const wsServer = new WebSocketServer(8080)

console.log('web socket server running on: ', wsServer.port)
