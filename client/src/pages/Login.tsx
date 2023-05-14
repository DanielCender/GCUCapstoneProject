import { useState } from 'react'
import { styled } from '@mui/system'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import { PageWrapper } from '../components/PageWrapper'
import { useNavContext } from '../state/NavContext'
import { PALETTE } from '../palette'
import { useUserContext } from '../state/UserContext'

const formHeight = 400

const FormContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
`

const FormModal = styled('div')`
  position: relative;
  width: 400px;
  height: 400px;
  top: calc(50% - ${formHeight}px);
  margin-left: auto;
  margin-right: auto;
  padding: 10px 25px;
  background-color: ${(props: any) => props.theme.palette.primary.main};
  border-radius: 25px;
  margin: 2rem 2rem;
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

export const Login = () => {
  const { setCurrentPage } = useNavContext()
  const { setAuthToken } = useUserContext()

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (username == '') {
      setError('Username must be set')
      return
    }
    if (password == '') {
      setError('Must input password')
      return
    }

    const data = {
      username,
      password,
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.status !== 200) {
        setError(result.message)
        return
      }

      console.log('Response:', result)
      if (result.token) {
        setAuthToken(result.token)
        // localStorage.setItem('authToken', result.token)
      }
      setCurrentPage('worldselect')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <PageWrapper>
      <FormContainer>
        <FormModal>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <LoginHeader>Login</LoginHeader>
            <TextField
              label="Username"
              onChange={(e: any) => setUsername(e.target.value)}
              required
              variant="outlined"
              color="secondary"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
              value={username}
            />
            <TextField
              label="Password"
              onChange={(e: any) => setPassword(e.target.value)}
              required
              variant="outlined"
              color="secondary"
              type="password"
              value={password}
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
                Login
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                type="button"
                onClick={() => {
                  setCurrentPage('signup')
                }}
              >
                Sign Up
              </Button>
            </ButtonRow>
          </form>
        </FormModal>
      </FormContainer>
    </PageWrapper>
  )
}
