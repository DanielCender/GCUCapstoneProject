import { styled } from '@mui/system'

import { SceneWrapper } from '../components/Scene/SceneWrapper'
import ChatMessageBox from '../components/Scene/ChatMessageBox'
import { ChatContextProvider } from '../state/ChatContext'
import { WebSocketContextProvider } from '../state/WebSocketContext'
import ConnectedUserAvatarList from '../components/Scene/ConnectedUserAvatarList'
import { ConnectedUsersList } from '../components/Scene/ConnectedUsersList'
import { Whiteboard } from '../components/Scene/WhiteboardFrame'

const SceneContainer = styled('div')`
  display: flex;
  justify-content: stretch;
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
  /* display: flex; */
  /* justify-content: flex-end; */
  /* align-items: flex-end; */
  flex-direction: column;
  flex: 1;
  max-width: 25%;
`

const SceneWhiteboardBlock = styled('div')`
  margin: ${({ theme }: any) => theme.spacing(2)};
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: column;
  flex: 3;
  max-width: 75%;
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
              {/* <ConnectedUserAvatarList /> */}
              <ConnectedUsersList />
              <Whiteboard />
            </SceneWhiteboardBlock>
          </SceneContainer>
        </SceneWrapper>
      </WebSocketContextProvider>
    </ChatContextProvider>
  )
}

export { WorldScene }
