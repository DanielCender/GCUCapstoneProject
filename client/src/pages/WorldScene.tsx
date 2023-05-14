import { useState } from 'react'
import { styled } from '@mui/system'
import Button from '@mui/material/Button'
import AlertTitle from '@mui/material/AlertTitle'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import { PALETTE } from '../palette'

import { useWebSocketConnection } from '../hooks/index'
import { SceneWrapper } from '../components/Scene/SceneWrapper'
import { ChatBox } from '../components/Scene/ChatBoxAlt'
import CommentBox from '../components/Scene/ChatMessageBox'

const SceneContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  position: relative;
  height: 100%;
  background-color: ${(props: any) => props.theme.palette.primary.main};
  border-radius: 25px;
`

const WorldScene = () => {
  useWebSocketConnection()

  // return <>World Scene</>
  return (
    <SceneWrapper>
      <SceneContainer>
        <div style={{ height: 200, width: 500, border: '1px solid red' }}>
          Voice Chat Indicators
        </div>
        <CommentBox />
        {/* <ChatBox /> */}
      </SceneContainer>
    </SceneWrapper>
  )
}

export { WorldScene }
