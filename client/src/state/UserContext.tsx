import { useContext, createContext, PropsWithChildren, useMemo, useState } from 'react'
import { JWTTokenPayload } from '../../../types/Auth'

const jwtDecode = (t: string): { raw: string; header: object; payload: JWTTokenPayload } => {
  return {
    raw: t,
    header: JSON.parse(window.atob(t.split('.')[0])),
    payload: JSON.parse(window.atob(t.split('.')[1])),
  }
}

export type UserContextFields = {
  authenticated: boolean
  userId: string | null
  username: string | null
  logout: () => void
  setAuthToken: (token: string) => void
  authHeaders: {
    Authorization: string
  }
}

const defaultUserContext: UserContextFields = {
  authenticated: false,
  userId: null,
  username: null,
  logout: () => {},
  setAuthToken: (_: string) => {},
  authHeaders: {
    Authorization: 'Bearer ',
  },
}

export const UserAuthContext = createContext<UserContextFields>(defaultUserContext)

export const UserContextProvider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  // const userAuthed = checkAuthCookieSet()
  const [jwt, setJwt] = useState<string>(localStorage.getItem('authToken') ?? '')

  const userAuthInfo = useMemo(() => {
    let authInfo: Pick<UserContextFields, 'authHeaders' | 'userId' | 'username'> = {
      authHeaders: {
        Authorization: `Bearer ${jwt}`,
      },
      userId: null,
      username: null,
    }

    if (jwt) {
      const parsedToken = jwtDecode(jwt)
      authInfo.userId = parsedToken.payload.userId
      authInfo.username = parsedToken.payload.username
    }

    return authInfo
  }, [jwt])

  const setAuthToken = (token: string) => {
    // * Store so it's loaded on page refreshes
    localStorage.setItem('authToken', token)
    setJwt(token)
  }

  const logout = () => {
    localStorage.clear()
    setJwt('')
  }

  return (
    <UserAuthContext.Provider
      value={{
        authenticated: !!userAuthInfo.userId,
        setAuthToken,
        logout,
        ...userAuthInfo,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUserContext = () => useContext(UserAuthContext)
