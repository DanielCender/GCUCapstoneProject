import { useContext, createContext, PropsWithChildren, useState, SetStateAction } from 'react'

export type AppPage = 'home' | 'signup' | 'login' | 'worldselect' | 'avatarselect' | 'worldscene'

export type NavContextFields = {
  currentPage: AppPage
  setCurrentPage: React.Dispatch<SetStateAction<AppPage>>
}

const defaultUserContext: NavContextFields = {
  currentPage: 'home',
  setCurrentPage: () => {},
}

export const NavContext = createContext<NavContextFields>(defaultUserContext)

export const NavContextProvider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  // takes terminating route from the URL. Only supports one level deep, no nested routes
  const startingPage = location.href.slice(location.href.lastIndexOf('/') + 1) ?? null

  const [currentPage, setCurrentPage] = useState<AppPage>(
    (startingPage as AppPage) ?? defaultUserContext.currentPage
  )

  return (
    <NavContext.Provider
      value={{
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </NavContext.Provider>
  )
}

export const useNavContext = () => useContext(NavContext)
