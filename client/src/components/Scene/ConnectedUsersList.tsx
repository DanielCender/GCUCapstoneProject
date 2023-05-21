import { Avatar, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { PALETTE } from '../../palette'
import { useConnectedUsersContext } from '../../state/ConnectedUsersContext'

const RootContainer = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: auto;
  background-color: ${({ theme }: any) => theme.palette.background.paper};
  margin: ${({ theme }: any) => theme.spacing(2)};
  border-radius: 15px;
`

const BoxHeader = styled('div')`
  width: 100%;
  padding: 10px 0px;
  font-family: Ariel, sans-serif;
  font-weight: 400;
  font-style: italic;
  color: ${PALETTE['Non Photo blue']};
  text-shadow: 2px 2px 5px ${PALETTE['Sunset']};
`

const ScrollableContainer = styled('div')`
  display: flex;
  flex: 1;
  overflow-x: auto;
  padding: 16px;
  max-width: -webkit-fill-available;
`

const AvatarContainer = styled('div')`
  margin: ${({ theme }: any) => theme.spacing(1)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const UserName = styled(Typography)`
  color: ${PALETTE['Sunset']};
  text-shadow: 2px 2px 5px ${PALETTE['Bittersweet']};
`

// const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Emily Davis', 'Robert Brown']

const ConnectedUsersList = () => {
  const { users } = useConnectedUsersContext()

  return (
    <RootContainer>
      <BoxHeader>Connected Users</BoxHeader>
      <ScrollableContainer>
        {users.map((user, index) => (
          <AvatarContainer key={index}>
            <Avatar>{user.username[0]}</Avatar>
            <UserName align="center">{user.username}</UserName>
          </AvatarContainer>
        ))}
      </ScrollableContainer>
    </RootContainer>
  )
}

export { ConnectedUsersList }
