import useSWR from 'swr'
import { styled } from '@mui/system'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { PALETTE } from '../../palette'

const SelectWorldWrapper = styled('div')`
  position: relative;
  width: 70%;
  height: 700px;
  margin-left: auto;
  margin-right: auto;
  /* background-color: ${(props: any) => props.theme.palette.primary.main};
  border-radius: 25px; */
`
const PanelHeader = styled('h2')`
  font-family: Roboto, sans-serif;
  color: ${PALETTE['Non Photo blue']};
  text-shadow: 2px 2px 5px ${PALETTE['Sunset']};
`

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const ManageWorldsTable = () => {
  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/users/${localStorage.getItem(
      'userId'
    )}/worlds`,
    fetcher
  )

  if (error) return <>An error has occurred.</>
  if (isLoading) return <>Loading...</>

  console.log('data worlds: ', data)

  return (
    <SelectWorldWrapper>
      <PanelHeader>Rejoin Old Worlds</PanelHeader>

      {isLoading && <CircularProgress color="secondary" />}
      {error && <Alert severity="error">Error while fetching user worlds! {error}</Alert>}
      {data && <table></table>}
    </SelectWorldWrapper>
  )
}
