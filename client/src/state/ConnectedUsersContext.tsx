import { useContext, createContext, PropsWithChildren, useState, useEffect } from 'react'
import useSWR from 'swr'
import { Snackbar, Alert } from '@mui/material'
import { Contracts } from '../../../types/Contracts'
import { useUserContext } from './UserContext'

export type ConnectedUsersContextFields = {
  users: Contracts.GetWorldConnectedUsers.GetWorldConnectedUsersResponse
  addNewlyJoinedUser: (user: Contracts.GetWorldConnectedUsers.UserItem) => void
  removeLeavingUser: (userId: string) => void
}

const defaultConnectedUsersContext: ConnectedUsersContextFields = {
  users: [],
  addNewlyJoinedUser: () => {},
  removeLeavingUser: () => {},
}

export const ConnectedUsersContext = createContext<ConnectedUsersContextFields>(
  defaultConnectedUsersContext
)

export const ConnectedUsersContextProvider: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { authHeaders, userId } = useUserContext()
  const [isSnackbarOpen, setSnackbarOpen] = useState(false)
  const [users, setUsers] =
    useState<Contracts.GetWorldConnectedUsers.GetWorldConnectedUsersResponse>([])

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        ...authHeaders,
      },
    }).then((res) => res.json())

  const { data, error } = useSWR<Contracts.GetWorldConnectedUsers.GetWorldConnectedUsersResponse>(
    `${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/worlds/${localStorage.getItem(
      'worldId'
    )}/connectedUsers`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true)
      console.error(error.message)
    } else {
      data && setUsers(data)
    }
  }, [data, error])

  const addNewlyJoinedUser = (newMessage: Contracts.GetWorldConnectedUsers.UserItem) => {
    if (newMessage.id === userId) return
    setUsers((prev) => [...prev, newMessage])
  }

  const removeLeavingUser = (userId: string) => {
    setUsers((prev) => {
      const userIndex = prev.findIndex((user) => user.id === userId)
      return [...prev.slice(0, userIndex), ...prev.slice(userIndex + 1)]
    })
  }

  return (
    <ConnectedUsersContext.Provider
      value={{
        users,
        addNewlyJoinedUser,
        removeLeavingUser,
      }}
    >
      {children}
      <Snackbar open={isSnackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Error when fetching world's connected Users!
        </Alert>
      </Snackbar>
    </ConnectedUsersContext.Provider>
  )
}

export const useConnectedUsersContext = () => useContext(ConnectedUsersContext)
