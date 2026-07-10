import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }


  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'View'}</button>
      <div className='extra-info'style={{ display: visible ? '' : 'none' }}>
        <a href={blog.url}>{blog.url}</a><br/>
          Likes: {blog.likes} <button onClick={() => handleLike(blog)}>Like</button><br/>
        {blog.user ? blog.user.name : null}<br/>
        <button style={{ display: blog.user.username === user.username ? '' : 'none' }} onClick={() => handleDelete(blog)}>Remove</button>
      </div>
    </div>
  )
}

export default Blog