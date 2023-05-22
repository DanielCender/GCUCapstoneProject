import { useContext, createContext, PropsWithChildren, useState, useEffect } from 'react'
import {
  ClientSentWSMessageType,
  ServerSentWSMessageType,
  ServerWSMessage,
  WebSocketMessages,
} from '../../../types/Messages'
import { useChatContext } from './ChatContext'
import { useConnectedUsersContext } from './ConnectedUsersContext'

export const parseMessageToJSON = (messageString: string): ServerWSMessage | null => {
  try {
    return JSON.parse(messageString)
  } catch (e: any) {
    console.error('Error when parsing message string: ', e.message)
  }
  return null
}

export const WebSocketContext = createContext<WebSocket | null>(null)

export const WebSocketContextProvider: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { addNewMessage } = useChatContext()
  const { addNewlyJoinedUser, removeLeavingUser } = useConnectedUsersContext()
  const [socket, setSocket] = useState<WebSocket | null>(null)

  const protocol = window.location.protocol.replace('http', 'ws')
  const endpoint =
    process.env.NODE_ENV === 'production'
      ? import.meta.env.VITE_LITTLE_OFFICES_WS_SERVER_URL
      : `${protocol}//${window.location.hostname}:8080`

  const handleOnOpenSocket = (event: WebSocketEventMap['open']) => {
    console.log('Connected to WebSocket server')
    console.log('event: ', JSON.stringify(event, null, 2))
  }

  const handleOnMessageSocket = (event: WebSocketEventMap['message']) => {
    console.log(`Received message: ${event.data}`)
    console.log('typeof body: ', typeof event.data)
    const message = parseMessageToJSON(event.data)
    if (message === null) {
      console.warn('received unparsable message from service: ', event)
    }
    switch (message?.type) {
      case ServerSentWSMessageType.ChatMessageSent: {
        addNewMessage((message as WebSocketMessages.ChatMessageSentMessage).body)
        break
      }
      case ServerSentWSMessageType.UserJoined: {
        addNewlyJoinedUser((message as WebSocketMessages.UserJoinedMessage).body)
        break
      }
      case ServerSentWSMessageType.UserLeft: {
        removeLeavingUser((message as WebSocketMessages.UserLeftMessage).body.id)
        break
      }
    }
  }

  const handleOnCloseSocket = (event: WebSocketEventMap['close']) => {
    console.log('Disconnected from WebSocket server with event: ', event)
    // socket.close()
  }

  const handleOnErrorSocket = (event: WebSocketEventMap['error']) => {
    console.error('Failed to connect to WebSocket server:', event)
  }

  useEffect(() => {
    const newSocket = new WebSocket(endpoint)
    newSocket.addEventListener('open', () => {
      console.log('Connected to WebSocket server')
      console.log('event: ', JSON.stringify(event, null, 2))
      const message: WebSocketMessages.JoinWorldMessage = {
        type: ClientSentWSMessageType.JoinWorld,
        body: {
          authJwt: localStorage.getItem('authToken') ?? '',
          worldId: localStorage.getItem('worldId') ?? '',
        },
      }
      newSocket.send(JSON.stringify(message))
      // * Important to set socket only after it's in OPEN state
      setSocket(newSocket)
    })
    newSocket.addEventListener('message', handleOnMessageSocket)
    newSocket.addEventListener('close', handleOnCloseSocket)
    newSocket.addEventListener('error', handleOnErrorSocket)

    // * Close connections and remove all event handlers as context unmounts
    return () => {
      newSocket.removeEventListener('open', handleOnOpenSocket)
      newSocket.removeEventListener('message', handleOnMessageSocket)
      newSocket.removeEventListener('close', handleOnCloseSocket)
      newSocket.removeEventListener('error', handleOnErrorSocket)
      newSocket.close()
    }
  }, [])

  return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>
}

export const useWebSocketContext = () => useContext(WebSocketContext)
