// import { useState } from 'react'
import { Card, Button, CardContent, CardActions } from '@mui/material'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  // const [visible, setVisible] = useState(false)

  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5,
  // }

  if (!blog) {
    return null
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
