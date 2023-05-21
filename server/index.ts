import express from 'express'
import cors from 'cors'
import { APP_CONFIG } from './config'
import { authRouter, worldDataRouter } from './controllers'
import { WebSocketServer } from './boundaries/websockets'

const environment = APP_CONFIG()

const app = express()

app.use(cors())
app.use(express.json())

app.use(authRouter)
app.use(worldDataRouter)

// Define a route handler for the endpoint
app.get('/', (req, res) => {
  const htmlMessage =
    '<h1>Nothing to see here: Visit <a href="dcgcucapstone.netlify.app">Little Offices</a> instead!</h1>'
  res.send(htmlMessage)
})

// Start the server
app.listen(Number(environment.PORT), () => {
  console.log('Server is running on port ', environment.PORT)
})

const wsServer = new WebSocketServer(8080)

console.log('web socket server running on: ', wsServer.port)
