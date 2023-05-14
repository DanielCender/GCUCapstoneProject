import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { APP_CONFIG } from './config'
import { authRouter, userDataRouter } from './controllers'
import { WebSocketServer } from './boundaries/websockets'

const environment = APP_CONFIG()

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

app.use(cookieParser(environment.JWT_SIGNATURE) as any)

app.use(authRouter)
app.use(userDataRouter)

app.listen(3000) // for http interactions

const wsServer = new WebSocketServer(8080)

console.log('web socket server running on: ', wsServer.port)
