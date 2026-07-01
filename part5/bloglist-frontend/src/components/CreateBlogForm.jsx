import { useState } from 'react'
import blogService from '../services/blogs'

const CreateBlogForm = ({ setUser, blogs, setBlogs, setSuccessMessage, setErrorMessage }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlog = async event => {
    event.preventDefault(console.log('creating new blog'))
    try{
      const newBlog = {
        'title': title,
        'author': author,
        'url': url
      }
      console.log(newBlog)
      const savedBlog = await blogService.createNew(newBlog)
      console.log(savedBlog)
      setSuccessMessage(`The blog ${title} by ${author} was added`)
      setTimeout(() => setSuccessMessage(null), 5000)
      setTitle('')
      setAuthor('')
      setUrl('')
      setBlogs(blogs.concat(savedBlog))
    }
    catch(error){
      if (error.response){
        if (error.response.data.error.includes('token expired')){
          setUser(null)
          window.localStorage.clear()
          setErrorMessage('Session expired, please log in again')
          setTimeout(() => setErrorMessage(null), 5000)
          return
        }
      }
      setErrorMessage('Failed to create new blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          <label>
                Title
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
                Author
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
                URL
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default CreateBlogForm