import {
  useContext,
  createContext,
  PropsWithChildren,
  useState,
  SetStateAction,
  Dispatch,
} from 'react'

export type AppPage = 'home' | 'signup' | 'login' | 'worldselect' | 'avatarselect' | 'worldscene'
const APP_PAGE_OPTIONS: AppPage[] = [
  'home',
  'signup',
  'login',
  'worldselect',
  'avatarselect',
  'worldscene',
]

export type NavContextFields = {
  currentPage: AppPage
  setCurrentPage: Dispatch<SetStateAction<AppPage>>
}

const defaultUserContext: NavContextFields = {
  currentPage: 'home',
  setCurrentPage: () => {},
}

export const NavContext = createContext<NavContextFields>(defaultUserContext)

export const NavContextProvider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  // takes terminating route from the URL. Only supports one level deep, no nested routes
  const urlPathEnd = location.href.slice(location.href.lastIndexOf('/') + 1) ?? null

  const defaultPage = APP_PAGE_OPTIONS.includes(urlPathEnd as AppPage)
    ? (urlPathEnd as AppPage)
    : defaultUserContext.currentPage

  const [currentPage, setCurrentPage] = useState<AppPage>(defaultPage)

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
