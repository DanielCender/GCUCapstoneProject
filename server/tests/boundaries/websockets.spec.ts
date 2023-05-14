import { startServer, stopServer } from '../helpers/ws.helpers'

describe('WebSocket Server', () => {
  let server: WebSocket
  let client: typeof WebSocket

  beforeAll((done) => {
    // Start your WebSocket server before running the tests
    server = startServer(() => {
      client = new WebSocket('ws://localhost:8080')
      client.on('open', done)
    })
  })

  afterAll(() => {
    // Close the WebSocket connection and stop the server after the tests
    client.close()
    stopServer(server)
  })

  test('should handle greeting message', (done) => {
    client.on('message', (message) => {
      const data = JSON.parse(message)
      expect(data.type).toBe('greeting')
      expect(data.name).toBe('Alice')
      done()
    })

    const greetingMessage = { type: 'greeting', name: 'Alice' }
    client.send(JSON.stringify(greetingMessage))
  })

  test('should handle echo message', (done) => {
    const echoMessage = { type: 'echo', message: 'Hello, World!' }

    client.on('message', (message) => {
      expect(message).toBe(JSON.stringify(echoMessage))
      done()
    })

    client.send(JSON.stringify(echoMessage))
  })
})
