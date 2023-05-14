import { styled } from '@mui/system'
import { PALETTE } from '../../palette'
import { WebSocketMessages } from '../../../../types/Messages'

const ChatBoxContainer = styled('div')`
  /* display: flex;
  flex-direction: column;
  justify-content: flex-start; */
  height: 600px;
  width: 800px;
  background-color: ${PALETTE['Russian violet']};
  border: 1px solid red;
`

const ChatMessagesContainer = styled('div')`
  /* display: flex;
  flex-direction: column;
  justify-content: flex-start; */
  width: 100%;
  height: 80%;
  overflow-y: scroll;
  background-color: ${PALETTE['Russian violet']};
  border: 1px solid green;
`

const renderMessage = (message: WebSocketMessages.ChatMessageSentMessage['body']) => {
  return (
    <div>
      <div>User Avatar</div>
      <div>{message.text}</div>
    </div>
  )
}

const ChatBox = () => {
  const messages: WebSocketMessages.ChatMessageSentMessage['body'][] = []

  return (
    <ChatBoxContainer>
      <ChatMessagesContainer>
        {messages.map((message) => renderMessage(message))}
      </ChatMessagesContainer>
      <div>Chat input box</div>
    </ChatBoxContainer>
  )
}

export { ChatBox }
