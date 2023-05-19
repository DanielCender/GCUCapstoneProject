import { useContext, createContext, PropsWithChildren, useState, useEffect } from 'react'

export const WebSocketContext = createContext<WebSocket | null>(null)

export const WebSocketContextProvider: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)

  const handleOnOpenSocket = (event: WebSocketEventMap['open']) => {
    console.log('Connected to WebSocket server')
    console.log('event: ', JSON.stringify(event, null, 2))
    // Send a message to the server
    // const message = { type: 'greeting', name: 'Bob' }
    // socket.send(JSON.stringify(message))
  }

  const handleOnMessageSocket = (event: WebSocketEventMap['message']) => {
    console.log(`Received message: ${event.data}`)

    // Close the connection after receiving a message
    // socket.close()
  }

  const handleOnCloseSocket = (event: WebSocketEventMap['close']) => {
    console.log('Disconnected from WebSocket server')
    // socket.close()
  }

  const handleOnErrorSocket = (event: WebSocketEventMap['error']) => {
    console.error('Failed to connect to WebSocket server:', event)
  }

  useEffect(() => {
    const newSocket = new WebSocket(`${import.meta.env.VITE_LITTLE_OFFICES_WS_SERVER_URL}`)
    newSocket.addEventListener('open', handleOnOpenSocket)
    newSocket.addEventListener('message', handleOnMessageSocket)
    newSocket.addEventListener('close', handleOnCloseSocket)
    newSocket.addEventListener('error', handleOnErrorSocket)
    setSocket(newSocket)
    // * Close connections and remove all event handlers as context unmounts
    return () => {
      newSocket.removeEventListener('open', handleOnOpenSocket)
      newSocket.removeEventListener('message', handleOnMessageSocket)
      newSocket.removeEventListener('close', handleOnCloseSocket)
      newSocket.removeEventListener('error', handleOnErrorSocket)
      newSocket.close()
    }
  }, [])

  //   return () => {
  //     socket.removeEventListener('open', handleOnOpenSocket)
  //     socket.removeEventListener('message', handleOnMessageSocket)
  //     socket.removeEventListener('close', handleOnCloseSocket)
  //     socket.removeEventListener('error', handleOnErrorSocket)
  //     socket.close()
  //   }

  return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>
}

export const useWebSocketContext = () => useContext(WebSocketContext)
