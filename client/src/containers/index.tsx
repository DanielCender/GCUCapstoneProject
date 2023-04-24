import { useMemo } from 'react';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { useNavContext } from '../state/NavContext';
import { AppPage } from '../state/NavContext';


const getCurrentPage = (appPage: AppPage) => {
    const appMap: Record<AppPage, React.ReactElement> = {
        'home': <Home />,
        'login': <Login />,
        'signup': <Signup />,
        'worldselect': <>Now at world select, coming soon</>,
    }

    return appMap[appPage];
}


/**
 * @description Instead of implementing react-router or another tool with more overhead, uses global state to select the page to render.
 * @returns Containerized React page component
 */
export const SiteContainer = () => {
    let ui: React.ReactElement = <></>;

    const { currentPage } = useNavContext();
    ui = useMemo(() => getCurrentPage(currentPage), [currentPage]);

    return (
        <>
        {ui}
        </>
    )
}