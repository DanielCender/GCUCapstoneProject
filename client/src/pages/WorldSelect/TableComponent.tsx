import { useState } from 'react'
import useSWR from 'swr'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import { styled } from '@mui/system'
import { Contracts } from '../../../../types/Contracts'
import { useUserContext } from '../../state/UserContext'

const ActionsWrapper = styled('div')`
  display: flex;
  justify-content: flex-end;
`

const TableComponent = () => {
  const { username, authHeaders } = useUserContext()
  const [isSnackbarOpen, setSnackbarOpen] = useState(false)

  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        ...authHeaders,
      },
    }).then((res) => res.json())

  const { data, error, isLoading, mutate } = useSWR<Contracts.GetWorlds.GetWorldsResponse>(
    `${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/worlds`,
    fetcher
  )

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log('Text copied to clipboard:', textToCopy)
        setSnackbarOpen(true) // Show the Snackbar
      })
      .catch((error) => {
        console.error('Error copying text:', error)
        alert('not able to copy to clipboard')
      })
  }

  const deleteWorld = (worldId: string) => {
    fetch(`${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/worlds/${worldId}`, {
      headers: {
        ...authHeaders,
      },
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((jsonRes) => {
        console.log('delete result: ', JSON.stringify(jsonRes))
        console.log(jsonRes)
        mutate()
      })
  }

  return (
    <TableContainer sx={{ innerWidth: 800 }}>
      {isLoading && <CircularProgress color="secondary" />}
      {error && <Alert severity="error">Error while fetching user worlds! {error}</Alert>}
      {!isLoading && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>World Owner</TableCell>
              <TableCell>Security Level</TableCell>
              <TableCell>Copy ID</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data ?? []).map((world: Contracts.GetWorlds.GetWorldsItem) => (
              <TableRow key={world.id}>
                <TableCell>{world.id}</TableCell>
                <TableCell>{world.worldName}</TableCell>
                <TableCell>{world.ownerName === username ? 'Myself' : world.ownerName}</TableCell>
                <TableCell>
                  {world.worldHasPassword ? 'Passcode Protected' : 'No Passcode'}
                </TableCell>
                <TableCell>
                  <ActionsWrapper>
                    <IconButton
                      color="info"
                      aria-label="copy-id"
                      onClick={() => copyToClipboard(world.id)}
                    >
                      <ContentPasteIcon />
                    </IconButton>
                  </ActionsWrapper>
                </TableCell>
                <TableCell>
                  <ActionsWrapper>
                    <IconButton
                      color="secondary"
                      aria-label="delete"
                      onClick={() => deleteWorld(world.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ActionsWrapper>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Snackbar open={isSnackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Text copied to clipboard!
        </Alert>
      </Snackbar>
    </TableContainer>
  )
}

export default TableComponent
