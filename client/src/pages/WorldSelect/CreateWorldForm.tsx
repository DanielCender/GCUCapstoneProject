import { FunctionComponent, useState } from 'react'
import { styled } from '@mui/system'
import Button from '@mui/material/Button'
import AlertTitle from '@mui/material/AlertTitle'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import { PALETTE } from '../../palette'

const formHeight = 400
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

export const WorldCreateForm: FunctionComponent<{ returnToWorldList: VoidFunction }> = ({
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
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/worlds`, {
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
        <PanelHeader>Create New World</PanelHeader>
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
