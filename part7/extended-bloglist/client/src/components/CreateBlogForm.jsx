import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import { useNotificationActions } from '../store/notificationStore'
import { useBlogActions } from '../store/blogStore'
import { useUserActions } from '../store/userStore'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'

const CreateBlogForm = () => {
  const titleField = useField('text')
  const authorField = useField('text')
  const urlField = useField('text')
  const formStyle = {
    marginBottom: 10,
  }

  const { setNotification } = useNotificationActions()
  const { addBlog } = useBlogActions()
  const { logout } = useUserActions()
  const navigate = useNavigate()

  const handleNewBlog = async (event) => {
    event.preventDefault(console.log('creating new blog'))
    try {
      const newBlog = {
        title: titleField.value,
        author: authorField.value,
        url: urlField.value,
      }
      await addBlog(newBlog)
      setNotification({
        text: `The blog ${titleField.value} by ${authorField.value} was added`,
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
      <form onSubmit={handleNewBlog}>
        <div>
          <TextField
            style={formStyle}
            label="Title"
            {...{ ...titleField, reset: null }}
          />
        </div>
        <div>
          <TextField
            style={formStyle}
            label="Author"
            {...{ ...authorField, reset: null }}
          />
        </div>
        <div>
          <TextField
            style={formStyle}
            label="URL"
            {...{ ...urlField, reset: null }}
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
