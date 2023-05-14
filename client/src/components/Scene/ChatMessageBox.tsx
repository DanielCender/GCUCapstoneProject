import { useState } from 'react'
import { styled } from '@mui/system'
import { Paper, InputBase, IconButton, Divider, List, ListItem, ListItemText } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

const CommentBoxContainer = styled(Paper)`
  margin: ${({ theme }) => theme.spacing(2)}px;
  padding: ${({ theme }) => theme.spacing(2)}px;
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
  background-color: ${({ theme }) => theme.palette.background.paper};
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
  margin-left: ${({ theme }) => theme.spacing(1)}px;
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
  const [comments, setComments] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (inputValue.trim()) {
      setComments((prev) => [...prev, inputValue])
      setInputValue('')
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
          value={inputValue}
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
