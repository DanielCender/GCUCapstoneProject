import { useState, SyntheticEvent } from 'react'
import { styled } from '@mui/system'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { PageWrapper } from '../../components/PageWrapper'
import { JoinWorldForm } from './JoinWorldForm'
import { ManageWorldsTable } from './ManageWorldsTable'
import { WorldCreateForm } from './CreateWorldForm'
import { PALETTE } from '../../palette'

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
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  )
}

export const WorldSelect = () => {
  const [value, setValue] = useState(0)

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
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
          <div>
            <JoinWorldForm />
            <ManageWorldsTable />
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <WorldCreateForm returnToWorldList={() => setValue(0)} />
        </TabPanel>
      </FormContainer>
    </PageWrapper>
  )
}
