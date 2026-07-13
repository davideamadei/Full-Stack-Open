// import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  // const [visible, setVisible] = useState(false)

  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5,
  // }

  if (!blog){
    return null
  }

  return (

    <div className='blog'>
      <h1>{blog.author}: {blog.title}</h1>

      <p><a href={blog.url}>{blog.url}</a></p>
      <p>Likes: {blog.likes} {user && <button style={{ display:user?'':'none' }} onClick={() => handleLike(blog)}>Like</button>}</p>
      {blog.user.name && <p>Added by {blog.user.name}</p>}
      {user && blog.user.username===user.username && <p><button onClick={() => handleDelete(blog)}>Remove</button></p>}
    </div>

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