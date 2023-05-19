import { useState } from 'react'
import { styled } from '@mui/system'
import Button from '@mui/material/Button'
import AlertTitle from '@mui/material/AlertTitle'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import { PALETTE } from '../../palette'
import { useNavContext } from '../../state/NavContext'
import { useUserContext } from '../../state/UserContext'

const JoinFormWrapper = styled(Grid)`
  position: relative;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  /* background-color: ${(props: any) => props.theme.palette.primary.main};
  border-radius: 25px; */
`

const RowStack = styled(Stack)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const PanelHeader = styled('h2')`
  font-family: Roboto, sans-serif;
  color: ${PALETTE['Non Photo blue']};
  text-shadow: 2px 2px 5px ${PALETTE['Sunset']};
`

const ButtonRow = styled(Stack)`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export const JoinWorldForm = () => {
  const { setCurrentPage } = useNavContext()
  const { authHeaders } = useUserContext()
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

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/worlds/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
          body: JSON.stringify(data),
        }
      )

      const result = await response.json()

      if (response.status !== 200) {
        setError(result.message)
        return
      }

      if (result.worldId) {
        localStorage.setItem('worldId', result.worldId)
        setCurrentPage('worldscene')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <JoinFormWrapper>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <PanelHeader>Join a Friend's World</PanelHeader>
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
