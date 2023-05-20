import { useContext, createContext, PropsWithChildren, useState, useEffect } from 'react'
import useSWR from 'swr'
import { Snackbar, Alert } from '@mui/material'
import { Contracts } from '../../../types/Contracts'
import { useUserContext } from './UserContext'

export type ChatContextFields = {
  messages: Contracts.GetWorldMessages.GetWorldMessagesResponse
  addNewMessage: (newMessage: Contracts.GetWorldMessages.MessageItem) => void
}

const defaultUserContext: ChatContextFields = {
  messages: [],
  addNewMessage: () => {},
}

export const ChatContext = createContext<ChatContextFields>(defaultUserContext)

export const ChatContextProvider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { authHeaders } = useUserContext()
  const [isSnackbarOpen, setSnackbarOpen] = useState(false)
  const [messages, setMessages] = useState<Contracts.GetWorldMessages.GetWorldMessagesResponse>([])

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        ...authHeaders,
      },
    }).then((res) => res.json())

  const { data, error } = useSWR<Contracts.GetWorldMessages.GetWorldMessagesResponse>(
    `${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/worlds/${localStorage.getItem(
      'worldId'
    )}/messages`,
    fetcher
  )

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true)
      console.error(error.message)
    } else {
      data && setMessages(data)
    }
  }, [data, error])

  const addNewMessage = (newMessage: Contracts.GetWorldMessages.MessageItem) => {
    setMessages((prev) => [...prev, newMessage])
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        addNewMessage,
      }}
    >
      {children}
      <Snackbar open={isSnackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Error when fetching world Messages!
        </Alert>
      </Snackbar>
    </ChatContext.Provider>
  )
}

export const useChatContext = () => useContext(ChatContext)
