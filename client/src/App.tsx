import { ThemeProvider } from '@mui/material/styles'
import { muiTheme } from './MuiTheme'

import './App.css'

// * App state
import { UserContextProvider } from './state/UserContext'
import { NavContextProvider } from './state/NavContext'

// * App Containers/pages
import { SiteContainer } from './containers/index'

function App() {
  return (
    <>
      <ThemeProvider theme={muiTheme}>
        <UserContextProvider>
          <NavContextProvider>
            <SiteContainer />
          </NavContextProvider>
        </UserContextProvider>
      </ThemeProvider>
    </>
  )
}

export default App
