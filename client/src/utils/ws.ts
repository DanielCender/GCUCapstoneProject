export const createSocketConnection = () => {
  const socket = new WebSocket(`${import.meta.env.VITE_LITTLE_OFFICES_WS_SERVER_URL}`)

  const handleOnOpenSocket = (event: WebSocketEventMap['open']) => {
    console.log('Connected to WebSocket server')
    console.log('event: ', JSON.stringify(event, null, 2))
    // Send a message to the server
    const message = { type: 'greeting', name: 'Bob' }
    socket.send(JSON.stringify(message))
  }

  const handleOnMessageSocket = (event: WebSocketEventMap['message']) => {
    console.log(`Received message: ${event.data}`)

    // Close the connection after receiving a message
    socket.close()
  }

  const handleOnCloseSocket = (event: WebSocketEventMap['close']) => {
    console.log('Disconnected from WebSocket server')
    socket.close()
  }

  const handleOnErrorSocket = (event: WebSocketEventMap['error']) => {
    console.error('Failed to connect to WebSocket server:', event)
  }

  socket.addEventListener('open', handleOnOpenSocket)
  socket.addEventListener('message', handleOnMessageSocket)
  socket.addEventListener('close', handleOnCloseSocket)
  socket.addEventListener('error', handleOnErrorSocket)

  // * Close connections and remove all event handlers as component unmounts
  return () => {
    socket.removeEventListener('open', handleOnOpenSocket)
    socket.removeEventListener('message', handleOnMessageSocket)
    socket.removeEventListener('close', handleOnCloseSocket)
    socket.removeEventListener('error', handleOnErrorSocket)
    socket.close()
  }
}
