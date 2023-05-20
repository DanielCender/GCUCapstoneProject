import { styled } from '@mui/system'

import { SceneWrapper } from '../components/Scene/SceneWrapper'
import ChatMessageBox from '../components/Scene/ChatMessageBox'
import { ChatContextProvider } from '../state/ChatContext'
import { WebSocketContextProvider } from '../state/WebSocketContext'

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
  return (
    <ChatContextProvider>
      <WebSocketContextProvider>
        <SceneWrapper>
          <SceneContainer>
            <div style={{ height: 150, width: 400, border: '1px solid red' }}>
              Voice Chat Indicators
            </div>
            <ChatMessageBox />
            {/* <ChatBox /> */}
          </SceneContainer>
        </SceneWrapper>
      </WebSocketContextProvider>
    </ChatContextProvider>
  )
}

export { WorldScene }
