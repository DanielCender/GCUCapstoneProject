import { FunctionComponent, useState, SyntheticEvent, SetStateAction } from 'react'
import { PageWrapper } from '../components/PageWrapper'
import { styled } from '@mui/system'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import FormGroup from '@mui/material/FormGroup'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import AlertTitle from '@mui/material/AlertTitle'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { useNavContext } from '../state/NavContext'
import { PALETTE } from '../palette'

const formHeight = 400

const FormContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  position: relative;
  top: -250px;
  background-color: ${(props: any) => props.theme.palette.primary.main};
  border-radius: 25px;
`

const FormModal = styled('div')`
  position: relative;
  width: 400px;
  height: 400px;
  top: calc(50% - ${formHeight}px);
  margin-left: auto;
  margin-right: auto;
  padding: 10px 25px;
  /* background-color: ${(props: any) => props.theme.palette.primary.main};
  border-radius: 25px; */
  margin: 2rem 2rem;
`

const JoinFormWrapper = styled(Grid)`
  position: relative;
  width: 500px;
  height: 400px;
  margin-left: auto;
  margin-right: auto;
  /* background-color: ${(props: any) => props.theme.palette.primary.main};
  border-radius: 25px; */
`

const FormRow = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: row;
  /* margin-left: auto; */
  /* margin-right: auto; */
  /* padding: 10px 25px; */
  /* background-color: ${(props: any) => props.theme.palette.primary.main};
  border-radius: 25px; */
  /* margin: 2rem 2rem; */
`

const LoginHeader = styled('h2')`
  font-family: Roboto, sans-serif;
  color: ${PALETTE['Non Photo blue']};
  text-shadow: 2px 2px 5px ${PALETTE['Sunset']};
`

const ButtonRow = styled(Stack)`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const RowStack = styled(Stack)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const WorldCreateForm: FunctionComponent<{ returnToWorldList: VoidFunction }> = ({
  returnToWorldList,
}) => {
  const [worldname, setWorldname] = useState<string>('')
  const [worldPassword, setWorldPassword] = useState<string | null>(null)
  const [worldPasswordConfirmation, setWorldPasswordConfirmation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (worldname == '') {
      setError('Username must be set')
      return
    }
    if (worldPassword == '') {
      setError('Must input password')
      return
    }

    if (worldPassword !== worldPasswordConfirmation) {
      setError('Password and confirmation must match!')
      return
    }

    const data = {
      worldname,
      worldPassword,
      ownerId: localStorage.getItem('userId'),
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/world`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.status !== 200) {
        setError(result.message)
        return
      }

      console.log('Response:', result)
      alert('Successfully created new world: ' + result.name)
      returnToWorldList()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <FormModal>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <LoginHeader>Create New World</LoginHeader>
        <TextField
          label="World Name"
          onChange={(e: any) => setWorldname(e.target.value)}
          required
          variant="outlined"
          color="secondary"
          type="text"
          sx={{ mb: 3 }}
          fullWidth
          value={worldname}
        />
        <TextField
          label="Password (optional)"
          onChange={(e: any) => setWorldPassword(e.target.value)}
          variant="outlined"
          color="secondary"
          type="password"
          value={worldPassword}
          fullWidth
          sx={{ mb: 3 }}
        />
        <TextField
          label="Confirm Password"
          onChange={(e: any) => setWorldPasswordConfirmation(e.target.value)}
          variant="outlined"
          color="secondary"
          type="password"
          value={worldPasswordConfirmation}
          fullWidth
          sx={{ mb: 3 }}
        />
        {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        <ButtonRow spacing={2} direction="row">
          <Button variant="contained" color="secondary" type="submit">
            Create
          </Button>
        </ButtonRow>
      </form>
    </FormModal>
  )
}

const JoinWorldForm = () => {
  const { setCurrentPage } = useNavContext()

  const [worldId, setWorldId] = useState<string>('')
  const [worldPassword, setWorldPassword] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (worldId == '') {
      setError('World ID must be set')
      return
    }

    const data = {
      worldId,
      worldPassword,
    }

    // todo: Write handler to make WebSocket connection to server for this World ID

    // try {
    //   const response = await fetch(`${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/joinWorld`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     // credentials: 'include',
    //     body: JSON.stringify(data),
    //   })

    //   const result = await response.json()

    //   if (response.status !== 200) {
    //     setError(result.message)
    //     return
    //   }

    //   console.log('Response:', result)
    //   if (result.userId) {
    //     localStorage.setItem('userId', result.userId)
    //   }
    //   setCurrentPage('worldselect')
    // } catch (error) {
    //   console.error('Error:', error)
    // }
  }

  return (
    <JoinFormWrapper>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <LoginHeader>Join a Friend's World</LoginHeader>
        <RowStack direction="row" spacing={2}>
          <TextField
            label="World ID"
            onChange={(e: any) => setWorldId(e.target.value)}
            required
            variant="outlined"
            color="secondary"
            type="text"
            value={worldId}
            size="small"
          />
          <TextField
            label="World Password (opt)"
            onChange={(e: any) => setWorldPassword(e.target.value)}
            required
            variant="outlined"
            color="secondary"
            type="password"
            value={worldPassword}
            size="small"
          />
          <ButtonRow spacing={2} direction="row">
            <Button variant="contained" color="secondary" type="submit">
              Join
            </Button>
          </ButtonRow>
        </RowStack>
        {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
      </form>
    </JoinFormWrapper>
  )
}

const ManageExistingWorldsGrid = () => {
  // todo: Use a SWR fetch hook, or useEffect, to query the world IDs already created by the user

  return (
    <JoinFormWrapper>
      <LoginHeader>Rejoin Old Worlds</LoginHeader>
      {/* todo: Render out table of existing owned worlds */}
    </JoinFormWrapper>
  )
}

const WorldManagementForm = () => {
  return (
    <div>
      <JoinWorldForm />
      <ManageExistingWorldsGrid />
    </div>
  )
}

export const WorldSelect = () => {
  const [value, setValue] = useState(0)

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <PageWrapper>
      <FormContainer>
        <Box
          sx={{ width: '100%' }}
          style={{
            backgroundColor: PALETTE['Non Photo blue'],
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Tabs value={value} onChange={handleChange} aria-label="World Select/Create Tabs">
            <Tab label="Select World" {...a11yProps(0)} />
            <Tab label="Create World" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <WorldManagementForm />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <WorldCreateForm returnToWorldList={() => setValue(0)} />
        </TabPanel>
      </FormContainer>
    </PageWrapper>
  )
}
