import { useState } from 'react'
import { PageWrapper } from '../components/PageWrapper'
import { styled } from '@mui/system'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import { useNavContext } from '../state/NavContext'
import { PALETTE } from '../palette'

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

export const Signup = () => {
  const { setCurrentPage } = useNavContext()

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')
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

    if (password !== passwordConfirmation) {
      setError('Password and confirmation must match!')
      return
    }

    const data = {
      username,
      password,
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/signup`, {
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
      alert('Redirecting to sign in page')
      setCurrentPage('login')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <PageWrapper>
      <FormContainer>
        <FormModal>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <LoginHeader>Sign Up</LoginHeader>
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
            <TextField
              label="Confirm Password"
              onChange={(e: any) => setPasswordConfirmation(e.target.value)}
              required
              variant="outlined"
              color="secondary"
              type="password"
              value={passwordConfirmation}
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
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setCurrentPage('login')
                }}
              >
                Back to Login
              </Button>
              <Button variant="contained" color="secondary" type="submit">
                Register
              </Button>
            </ButtonRow>
          </form>
        </FormModal>
      </FormContainer>
    </PageWrapper>
  )
}
