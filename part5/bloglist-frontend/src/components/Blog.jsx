import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, blogs, setBlogs }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    updatedBlog.user = blog.user.id
    const response = await blogService.update(updatedBlog)
    setBlogs(blogs.map(b => b.id === updatedBlog.id ? response : b).sort((a, b) => b.likes - a.likes))
  }

  const handleDelete = async () => {
    if(window.confirm(`Are you sure you want to remove ${blog.title} by ${blog.author}?`)){
      try{
        await blogService.deleteBlog(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (error){
        if (error.response) {
          console.log(error.response.data, error.response.status, error.response.headers)
        }
      }

    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'View'}</button>
        <div style={{ display: visible ? '' : 'none' }}>
          <a href={blog.url}>{blog.url}</a><br/>
          {blog.likes} likes <button onClick={handleLike}>Like</button><br/>
          {blog.user ? blog.user.name : null}<br/>
          <button style={{ display: blog.user.username === user.username ? '' : 'none' }} onClick={handleDelete}>Remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog