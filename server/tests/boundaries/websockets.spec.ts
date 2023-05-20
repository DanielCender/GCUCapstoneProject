// import {
//   describe,
//   expect,
//   test,
//   jest,
//   afterAll,
//   afterEach,
//   beforeAll,
//   beforeEach,
// } from '@jest/globals'

// import WebSocket from 'ws'
// import { WebSocketServer } from '../../boundaries/websockets'

// describe('WebSocketServer', () => {
//   let server: WebSocketServer
//   let client: WebSocket

//   beforeAll(() => {
//     server = new WebSocketServer(8080)
//     console.log('server in beforeAll: ', server)
//   })

//   afterAll(() => {
//     server.close()
//   })

//   beforeEach((done) => {
//     client = new WebSocket('ws://localhost:8080')
//     console.log('new client: ', client)
//     // client.on('open', done)
//     setTimeout(() => done(), 1000)
//   })

//   afterEach(() => {
//     console.log('client: ', client)
//     client.close()
//   })

//   test('should handle incoming message', (done) => {
//     const message = Buffer.from(JSON.stringify({ type: 'greeting', name: 'Alice' }))

//     server.handleMessage = jest.fn((socket, message: any) => {
//       const messageString = message.toString('utf8')
//       expect(messageString).toBe('{"type":"greeting","name":"Alice"}')
//       done()
//     }) as any

//     client.send(message)
//   })

//   test('should handle socket close', (done) => {
//     server.handleClose = jest.fn((socket, code, reason) => {
//       expect(code).toBe(1000)
//       expect(reason).toBe('Socket closed')
//       done()
//     })

//     client.close(1000, 'Socket closed')
//   })

//   test('should handle socket error', (done) => {
//     server.handleError = jest.fn((socket, error: any) => {
//       expect(error.message).toBe('Socket error')
//       done()
//     })

//     client.emit('error', new Error('Socket error'))
//   })

//   test('should send response back to the client', (done) => {
//     const message = Buffer.from(JSON.stringify({ type: 'greeting', name: 'Alice' }))

//     server.handleMessage = jest.fn(async (socket: WebSocket, message: any) => {
//       const response = `Received your message: ${message.toString('utf8')}`
//       socket.send(response)

//       expect(socket.send).toHaveBeenCalledWith(response)
//       done()
//     })

//     client.send(message)
//   })

//   test('should send message publish to all clients', (done) => {
//     server.handleMessage = jest.fn() as any

//     server.server.clients.forEach((client) => {
//       client.send = jest.fn()
//     })

//     server.server.clients.add(client)

//     server.handleMessage(client, Buffer.from(JSON.stringify({ type: 'publish', message: 'Hello' })))

//     server.server.clients.forEach((client) => {
//       expect(client.send).toHaveBeenCalledWith('Message publish')
//     })

//     done()
//   })
// })
