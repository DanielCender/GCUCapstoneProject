import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/system'
import { PALETTE } from '../../palette'
import { WebSocketMessages } from '../../../../types/Messages'

const renderListItem = (message: WebSocketMessages.ChatMessageSentMessage['body']) => {
  return (
    <ListItem key={`chat-message-${message.userId}`} component="div" disablePadding>
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      </ListItemAvatar>
      <ListItemText
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {message.username}
            </Typography>
            {message.text}
          </React.Fragment>
        }
      />
    </ListItem>
  )
}

const ChatBoxContainer = styled('div')`
  height: 600px;
  width: 800px;
  background-color: ${PALETTE['Russian violet']};
  border: 1px solid red;
`

const ChatMessagesContainer = styled('div')`
  width: 100%;
  height: 90%;
  overflow-y: scroll;
  background-color: ${PALETTE['Russian violet']};
  border: 1px solid green;
`

const ChatFormContainer = styled('div')`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${PALETTE['Russian violet']};
  border: 1px solid green;
`

const ChatBox = () => {
  const messages: WebSocketMessages.ChatMessageSentMessage['body'][] = new Array(50)
    .fill(null)
    .map((_item, i) => {
      return {
        text: 'random text' + ` - item - ${i}`,
        userId: 'random-id-' + `${i}`,
        username: 'random-username',
        avatar: 'player-1',
        created_at: new Date(Date.now() + i * 10000).toISOString(),
      }
    })
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const [chatMessage, setChatMesage] = React.useState<string>('')

  const handleChatMessageSubmit = () => {
    // todo: fill out with ws message publish
  }

  return (
    <ChatBoxContainer>
      <ChatMessagesContainer>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }} component="div" ref={scrollRef}>
          {messages.map((message, i, arr) => {
            return (
              <>
                {renderListItem(message)}
                {i !== arr.length - 1 && <Divider variant="inset" component="li" />}
              </>
            )
          })}
          <div style={{ float: 'left', clear: 'both' }} ref={scrollRef}></div>
        </List>
      </ChatMessagesContainer>
      <ChatFormContainer>
        <form id="submit-chat-message" onSubmit={handleChatMessageSubmit}>
          <TextField
            // label="World Name"
            onChange={(e: any) => setChatMesage(e.target.value)}
            required
            variant="outlined"
            color="secondary"
            type="text"
            sx={{ mb: 2 }}
            fullWidth
            value={chatMessage}
          />
        </form>
      </ChatFormContainer>
    </ChatBoxContainer>
  )
}

export { ChatBox }
