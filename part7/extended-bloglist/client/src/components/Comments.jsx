import { useField } from '../hooks'
import { useBlogActions } from '../store/blogStore'
import { Button, TextField, Box, Container, Paper } from '@mui/material'
import { useUser } from '../store/userStore'

const Comments = ({ blog }) => {
  const commentField = useField('text')
  const { addComment } = useBlogActions()
  const user = useUser()
  const handleCommentSubmit = async (event) => {
    event.preventDefault()
    try {
      await addComment(blog.id, commentField.value)
      commentField.reset()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const textStyle = {
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 15,
  }

  return (
    <div>
      <h2 style={{ ...textStyle, marginTop: 30 }}>Comments</h2>
      {user && (
        <form style={textStyle} onSubmit={handleCommentSubmit}>
          <TextField
            {...{ ...commentField, reset: null }}
            label="add a comment"
            multiline
            fullWidth
            variant="outlined"
            style={{ marginTop: 10 }}
          />
          <br />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: 10 }}
          >
            Add Comment
          </Button>
        </form>
      )}
      <Container style={{ marginTop: 20 }}>
        {blog.comments.length === 0 ? (
          <p style={{ ...textStyle, marginTop: 10 }}>No comments yet.</p>
        ) : (
          <div>
            {blog.comments.map((comment, index) => (
              <Paper
                sx={{
                  p: 2,
                  border: '1px solid grey',
                  width: 'fit-content',
                  maxWidth: 1,
                }}
                key={index}
                style={{
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  marginBottom: 10,
                }}
              >
                {comment}
              </Paper>
            ))}
          </div>
        )}
      </Container>
      {/* <ul style={{ ...textStyle, marginTop: 20 }}>
        {blog.comments.map((comment, index) => (
          <li
            key={index}
            style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
          >
            {comment}
          </li>
        ))}
      </ul> */}
    </div>
  )
}

export default Comments
