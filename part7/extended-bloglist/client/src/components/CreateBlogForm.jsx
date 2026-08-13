import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import { useNotificationActions } from '../store/notificationStore'
import { useBlogActions } from '../store/blogStore'
import { useUserActions } from '../store/userStore'
import { useNavigate } from 'react-router-dom'

const CreateBlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const formStyle = {
    marginBottom: 10,
  }

  const { setNotification } = useNotificationActions()
  const { addBlog } = useBlogActions()
  const { logout } = useUserActions()
  const navigate = useNavigate()

  const handleNewBlog = async (event, title, author, url) => {
    event.preventDefault(console.log('creating new blog'))
    try {
      const newBlog = {
        title: title,
        author: author,
        url: url,
      }
      await addBlog(newBlog)
      setNotification({
        text: `The blog ${title} by ${author} was added`,
        type: 'success',
      })
      console.log(`Added new blog: ${newBlog}`)
      navigate('/')
    } catch (error) {
      console.error('Error creating new blog:', error)
      if (error.response) {
        if (error.response.data.error.includes('token expired')) {
          logout()
          setNotification({
            text: 'Session expired, please log in again',
            type: 'error',
          })
          navigate('/login')
          return
        }
      }
      setNotification({ text: 'Failed to create new blog', type: 'error' })
    }
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={(e) => handleNewBlog(e, title, author, url)}>
        <div>
          <TextField
            style={formStyle}
            label="Title"
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            style={formStyle}
            label="Author"
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            style={formStyle}
            label="URL"
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button type="submit" variant="contained">
          Create
        </Button>
      </form>
    </div>
  )
}

export default CreateBlogForm
