// import { useState } from 'react'

import { Card, Button, CardContent, CardActions } from '@mui/material'

import { useNotificationActions } from '../store/notificationStore'
import { useBlogActions } from '../store/blogStore'
import { useUser, useUserActions } from '../store/userStore'
import { useNavigate } from 'react-router-dom'

import Comments from './Comments'

const Blog = ({ blog }) => {
  const { setNotification } = useNotificationActions()
  const { updateBlog, deleteBlog } = useBlogActions()
  const user = useUser()
  const { logout } = useUserActions()
  const navigate = useNavigate()

  if (!blog) {
    return <p>Blog not found</p>
  }

  const handleLike = async (blog) => {
    if (!user) {
      setNotification({
        text: 'You must be logged in to like posts',
        type: 'error',
      })
    }
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    updatedBlog.user = blog.user.id
    try {
      await updateBlog(updatedBlog)
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
    }
  }

  const handleDelete = async (blog) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${blog.title} by ${blog.author}?`
      )
    ) {
      try {
        await deleteBlog(blog.id)
        navigate('/')
      } catch (error) {
        if (error.response) {
          console.log(
            error.response.data,
            error.response.status,
            error.response.headers
          )
        }
      }
    }
  }

  const textStyle = {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
  }
  return (
    <Card
      className="blog"
      raised={true}
      // style={{ width: '100%' }}
      sx={{ marginTop: 5, display: 'flex' }}
    >
      <CardContent
        sx={{ display: 'flex', flex: 1, minWidth: 0, flexDirection: 'column' }}
      >
        <h1 style={textStyle}>{blog.title}</h1>
        <h2 style={{ ...textStyle, color: 'grey' }}>by {blog.author}</h2>
        <p style={textStyle}>
          <a href={blog.url}>{blog.url}</a>
        </p>
        {blog.user.name && <p style={textStyle}>Added by {blog.user.name}</p>}
        <p style={{ ...textStyle, fontSize: 21 }}>
          Likes: {blog.likes}
          {user && (
            <Button
              variant="outlined"
              sx={{ marginLeft: '10px' }}
              onClick={() => handleLike(blog)}
            >
              Like
            </Button>
          )}
        </p>
        <Comments blog={blog} />
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          alignSelf: 'flex-start',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
        }}
      >
        {user && blog.user.username === user.username && (
          <Button
            color="error"
            variant="outlined"
            onClick={() => handleDelete(blog)}
          >
            Remove
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default Blog
