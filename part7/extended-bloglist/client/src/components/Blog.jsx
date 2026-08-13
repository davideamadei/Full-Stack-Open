// import { useState } from 'react'
import { Card, Button, CardContent, CardActions } from '@mui/material'
import { useNotificationActions } from '../store/notificationStore'
import { useBlogActions } from '../store/blogStore'
import { useUser } from '../store/userStore'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blog }) => {
  const { setNotification } = useNotificationActions()
  const { updateBlog, deleteBlog } = useBlogActions()
  const user = useUser()
  const navigate = useNavigate()

  if (!blog) {
    return null
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
    await updateBlog(updatedBlog)
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
    <Card className="blog" raised={true} sx={{ marginTop: 5 }}>
      <CardContent>
        <h1 style={textStyle}>{blog.title}</h1>
        <h2 style={{ ...textStyle, color: 'grey' }}>by {blog.author}</h2>
        <p style={textStyle}>
          <a href={blog.url}>{blog.url}</a>
        </p>
        {blog.user.name && <p style={textStyle}>Added by {blog.user.name}</p>}
        <p style={{ ...textStyle, fontSize: 21 }}>Likes: {blog.likes}</p>
      </CardContent>
      <CardActions sx={{ marginLeft: '15px' }}>
        {user && (
          <Button variant="outlined" onClick={() => handleLike(blog)}>
            Like
          </Button>
        )}
        {user && blog.user.username === user.username && (
          <p>
            <Button
              color="error"
              variant="outlined"
              onClick={() => handleDelete(blog)}
            >
              Remove
            </Button>
          </p>
        )}
      </CardActions>
    </Card>

    // <div className='blog' style={blogStyle}>
    //   {blog.title} {blog.author}
    //   <button onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'View'}</button>
    //   <div className='extra-info'style={{ display: visible ? '' : 'none' }}>
    //     <a href={blog.url}>{blog.url}</a><br/>
    //       Likes: {blog.likes} <button onClick={() => handleLike(blog)}>Like</button><br/>
    //     {blog.user ? blog.user.name : null}<br/>
    //     <button style={{ display: user && (blog.user.username === user.username) ? '' : 'none' }} onClick={() => handleDelete(blog)}>Remove</button>
    //   </div>
    // </div>
  )
}

export default Blog
