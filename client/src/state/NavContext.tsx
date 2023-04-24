import { useContext, createContext, PropsWithChildren, useState, SetStateAction } from 'react';

export type AppPage = 'home' | 'signup' | 'login' | 'worldselect' | 'avatarselect';

export type NavContextFields = {
    currentPage: AppPage;
    setCurrentPage: React.Dispatch<SetStateAction<AppPage>>;
}

const defaultUserContext: NavContextFields = {
    currentPage: 'home',
    setCurrentPage: () => {}
}

export const NavContext = createContext<NavContextFields>(defaultUserContext);

export const NavContextProvider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
    const [currentPage, setCurrentPage] = useState<AppPage>(defaultUserContext.currentPage);

    return (
        <NavContext.Provider value={{
            currentPage,
            setCurrentPage,
        }}>
            {children}
        </NavContext.Provider>
    )
}

export const useNavContext = () => useContext(NavContext);