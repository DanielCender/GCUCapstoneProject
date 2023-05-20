import { useState } from 'react'
import { styled } from '@mui/system'
import { Paper, InputBase, IconButton, Divider, List, ListItem, ListItemText } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useUserContext } from '../../state/UserContext'

type StylePropTypes = { theme: { spacing: (nbr: number) => any } }

const CommentBoxContainer = styled(Paper)`
  margin: ${({ theme }: StylePropTypes) => theme.spacing(2)}px;
  padding: ${({ theme }: StylePropTypes) => theme.spacing(2)}px;
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
  background-color: ${({
    theme,
  }: StylePropTypes & {
    theme: {
      palette: { background: { paper: string } }
    }
  }) => theme.palette.background.paper};
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
  margin-left: ${({ theme }: StylePropTypes) => theme.spacing(1)}px;
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
  const [comments, setComments] = useState<string[]>([])
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (commentText == '') {
      setError('Comment cannot be empty')
      return
    }

    const data = {
      worldId: localStorage.getItem('worldId'),
      commentText,
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/worlds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.status !== 200) {
        setError(result.message)
        return
      }

      console.log('Response:', result)
      //   alert('Successfully created new world: ' + result.name)
      //   returnToWorldList()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <CommentBoxContainer component="form">
      <CommentList>
        {comments.map((comment, index) => (
          <CommentItem key={index}>
            <CommentText primary={comment} />
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
      </CommentForm>
    </CommentBoxContainer>
  )
}

export default CommentBox
