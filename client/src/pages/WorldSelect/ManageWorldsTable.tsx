import { styled } from '@mui/system'
import { PALETTE } from '../../palette'
import TableComponent from './TableComponent'

const SelectWorldWrapper = styled('div')`
  position: relative;
  height: 700px;
  margin-left: auto;
  margin-right: auto;
`

const PanelHeader = styled('h2')`
  font-family: Roboto, sans-serif;
  color: ${PALETTE['Non Photo blue']};
  text-shadow: 2px 2px 5px ${PALETTE['Sunset']};
`

export const ManageWorldsTable = () => {
  return (
    <SelectWorldWrapper>
      <PanelHeader>Rejoin Old Worlds</PanelHeader>
      <TableComponent />
    </SelectWorldWrapper>
  )
}
