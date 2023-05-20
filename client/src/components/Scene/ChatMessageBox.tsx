import * as React from 'react'
import { useEffect, useState, useRef } from 'react'
import { styled } from '@mui/system'
import {
  Paper,
  InputBase,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  AlertTitle,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useUserContext } from '../../state/UserContext'
import { useChatContext } from '../../state/ChatContext'
import { useWebSocketContext } from '../../state/WebSocketContext'
import { ClientSentWSMessageType, WebSocketMessages } from '../../../../types/Messages'

// type StylePropTypes = { theme: { spacing: (nbr: number) => any } }

const CommentBoxContainer = styled(Paper)`
  margin: ${({ theme }: any) => theme.spacing(2)}px;
  padding: ${({ theme }: any) => theme.spacing(2)}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  min-width: 300px;
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

const CommentForm = styled('form')`
  display: flex;
  align-items: center;
`

const CommentInput = styled(InputBase)`
  margin-left: ${({ theme }: any) => theme.spacing(1)}px;
  flex: 1;

  textarea {
    height: auto;
    line-height: inherit;
    padding: 0;
  }
`

const SendButton = styled(IconButton)`
  padding: 10px;
`

const CommentBox = () => {
  const { authHeaders } = useUserContext()
  const socket = useWebSocketContext()
  const { messages } = useChatContext()
  //   const [comments] = useState<string[]>([])
  const [commentText, setCommentText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value)
  }

  //   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //     console.log('in here')
  //     e.preventDefault()
  //     if (inputValue.trim()) {
  //       setComments((prev) => [...prev, inputValue])
  //       setInputValue('')
  //     }
  //   }

  //   useEffect(() => {
  //     const msg: WebSocketMessages.SendChatMessage = {
  //       type: ClientSentWSMessageType.SendChatMessage,
  //       body: {
  //         authJwt: localStorage.getItem('authToken') ?? '',
  //         worldId: localStorage.getItem('worldId') ?? '',
  //         text: 'sample text message',
  //       },
  //     }
  //     socket?.send(JSON.stringify(msg))
  //   }, [socket])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (commentText == '') {
      setError('Comment cannot be empty')
      return
    }

    try {
      const msg: WebSocketMessages.SendChatMessage = {
        type: ClientSentWSMessageType.SendChatMessage,
        body: {
          authJwt: localStorage.getItem('authToken') ?? '',
          worldId: localStorage.getItem('worldId') ?? '',
          text: commentText,
        },
      }
      socket?.send(JSON.stringify(msg))
      //   const response = await fetch(`${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/worlds`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       ...authHeaders,
      //     },
      //     body: JSON.stringify(data),
      //   })

      //   const result = await response.json()

      //   if (response.status !== 200) {
      //     setError(result.message)
      //     return
      //   }

      //   console.log('Response:', result)
      //   alert('Successfully created new world: ' + result.name)
      //   returnToWorldList()
    } catch (error: any) {
      console.error('Error:', error)
      alert(error.message)
    }
  }

  // * Setup auto-scroll whenever a new
  // todo: Make sure scroll doesn't start at top of chat list every time a new message received
  const scrollRef = useRef<HTMLUListElement>(null)
  useEffect(() => {
    scrollRef?.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <CommentBoxContainer>
      <CommentList ref={scrollRef}>
        {messages.map((comment, index, arr) => (
          <CommentItem
            key={index}
            //   ref={el => {
            //     if(index === arr.length - 1) {
            //         return scrollRef
            //     }
            //   }}
          >
            <CommentText primary={comment.authorName} secondary={comment.text} />
          </CommentItem>
        ))}
      </CommentList>
      <Divider />
      <CommentForm onSubmit={handleSubmit}>
        <CommentInput
          placeholder="Add a comment"
          inputProps={{ 'aria-label': 'add comment' }}
          value={commentText}
          onChange={handleInputChange}
          multiline={false} // Set to single-line
        />
        <SendButton type="submit" aria-label="send">
          <SendIcon />
        </SendButton>
        {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
      </CommentForm>
    </CommentBoxContainer>
  )
}

export default CommentBox
