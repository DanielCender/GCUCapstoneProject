import { useContext, createContext, PropsWithChildren } from 'react';

const AUTH_COOKIE = 'littleOfficesAuth';

function checkAuthCookieSet() {
    return document.cookie.split(";").some((item) => item.trim().startsWith(`${AUTH_COOKIE}=`));
  }


export type UserContextFields = {
    authenticated: boolean;
}

const defaultUserContext: UserContextFields = {
    authenticated: false,
}

export const UserAuthContext = createContext<UserContextFields>(defaultUserContext);

export const UserContextProvider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
    const userAuthed = checkAuthCookieSet()

    return (
        <UserAuthContext.Provider value={{
            authenticated: !!userAuthed,
        }}>
            {children}
        </UserAuthContext.Provider>
    )
}

export const useUserContext = () => useContext(UserAuthContext);