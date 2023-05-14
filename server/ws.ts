import WebSocket from 'ws'

export abstract class WSBoundary extends WebSocket.Server {}

const wsServer = new WebSocket.Server({ port: 8080 })
console.log('WebSocket server started on port 8080')

wsServer.on('connection', (socket: WebSocket) => {
  console.log('Client connected')

  socket.on('message', (message: string) => {
    console.log(`Received message: ${message}`)

    // Handle different types of messages
    try {
      const data = JSON.parse(message)
      switch (data.type) {
        case 'greeting':
          console.log(`Hello, ${data.name}!`)
          break
        case 'echo':
          socket.send(data.message)
          break
        default:
          console.log('Unknown message type:', data.type)
      }
    } catch (error) {
      console.error('Failed to parse message:', error)
    }
  })

  socket.on('close', () => {
    console.log('Client disconnected')
  })
})

export { wsServer }
