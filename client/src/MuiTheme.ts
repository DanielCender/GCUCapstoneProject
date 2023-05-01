import { createTheme } from '@mui/material/styles'
import { PALETTE } from './palette'

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: PALETTE['Russian violet'],
    },
    secondary: {
      main: PALETTE['Raspberry rose'],
    },
    info: {
      main: PALETTE.Sunset,
    },
    error: {
      main: PALETTE.Bittersweet,
    },
  },
})
