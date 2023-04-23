import http from 'http'
import express from 'express'
import cors from 'cors'
import { Client } from 'pg';
import { Server, LobbyRoom } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import { RoomType } from '../types/Rooms'
// import { LittleOffice } from './rooms/LittleOffice'

// import { APP_CONFIG } from './config';

// const environment = APP_CONFIG();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
client
  .connect()
  .then(() => console.log('connected'))
  .catch((err: Error) => console.error('connection error', err.stack))

const port = Number(process.env.PORT || 2567)
const app = express()

app.use(cors())
app.use(express.json())
// app.use(express.static('dist'))

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
