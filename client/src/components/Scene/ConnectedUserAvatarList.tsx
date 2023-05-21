import * as React from 'react'
import { useEffect, useState, useRef } from 'react'
import { styled } from '@mui/system'
import { Stack, Avatar, List, Paper, ListItem, ListItemText, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useChatContext } from '../../state/ChatContext'
import { useWebSocketContext } from '../../state/WebSocketContext'
import { ClientSentWSMessageType, WebSocketMessages } from '../../../../types/Messages'
import { PALETTE } from '../../palette'

function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  }
}

const ConnectedUserContainer = styled('div')`
  display: flex;
  width: inherit;
  background-color: ${({ theme }: any) => theme.palette.background.paper};
  /* max-height: 100px; */
  flex-direction: column;
  flex: 1;
  justify-content: column;
  align-items: stretch;
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

const UserName = styled(Typography)`
  color: ${PALETTE['Sunset']};
  text-shadow: 2px 2px 5px ${PALETTE['Bittersweet']};
`

const CommentList = styled(List)`
  width: 100%;
  max-height: 200px;
  overflow: auto;
  background-color: ${({ theme }: any) => theme.palette.background.paper};
`

const CommentItem = styled(ListItem)`
  padding-top: 0;
  padding-bottom: 0;
`

const CommentText = styled(ListItemText)`
  word-wrap: break-word;
`

// const CommentInput = styled(InputBase)`
//   margin-left: ${({ theme }: any) => theme.spacing(1)};
//   flex: 1;

//   textarea {
//     height: auto;
//     line-height: inherit;
//     padding: 0;
//   }
// `

const ConnectedUserAvatarList = () => {
  //   const socket = useWebSocketContext()
  // todo: Add support for connected users context

  return (
    <ConnectedUserContainer>
      <BoxHeader>Connected Users</BoxHeader>
      <Stack direction="row" spacing={2}>
        {new Array(20).fill(null).map((_e, i) => {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Avatar {...stringAvatar('Kent Dodds')} />
              <UserName variant="alignCenter">Kent Dodds</UserName>
            </div>
          )
        })}
      </Stack>
    </ConnectedUserContainer>
  )
}

export default ConnectedUserAvatarList
