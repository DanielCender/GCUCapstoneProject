import { ThemeProvider } from '@mui/material/styles'
import { muiTheme } from './MuiTheme';

import './App.css'

import {Home} from './pages/Home';




function App() {
  
  return (
    <>
    <ThemeProvider theme={muiTheme}>
      <Home/>
    </ThemeProvider>
    </>
  )
}

export default App
