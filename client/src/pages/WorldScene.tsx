import { styled } from '@mui/system'

import { SceneWrapper } from '../components/Scene/SceneWrapper'
import ChatMessageBox from '../components/Scene/ChatMessageBox'
import { ChatContextProvider } from '../state/ChatContext'
import { WebSocketContextProvider } from '../state/WebSocketContext'

const SceneContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 100vw;
  position: relative;
  height: 100%;
  background-color: ${(props: any) => props.theme.palette.primary.main};
  border-radius: 25px;
`

const SceneCommunicationBlock = styled('div')`
  height: 100%;
  padding-left: 30px;
  padding-top: 30px;
  padding-bottom: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-direction: column;
  /* flex: 1; */
`

const SceneWhiteboardBlock = styled('div')`
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  /* flex: 2; */
`

const WorldScene = () => {
  return (
    <ChatContextProvider>
      <WebSocketContextProvider>
        <SceneWrapper>
          <SceneContainer>
            <SceneCommunicationBlock>
              <ChatMessageBox />
            </SceneCommunicationBlock>
            <SceneWhiteboardBlock>
              <div style={{ border: '1px solid red', flex: 1 }}>Voice Chat Indicators</div>
              <div style={{ border: '1px solid red', flex: 6 }}>Whiteboard will go here</div>
            </SceneWhiteboardBlock>
          </SceneContainer>
        </SceneWrapper>
      </WebSocketContextProvider>
    </ChatContextProvider>
  )
}

export { WorldScene }
