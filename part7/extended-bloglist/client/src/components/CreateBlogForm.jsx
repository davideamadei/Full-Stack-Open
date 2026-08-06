import { useState } from 'react'
import { TextField, Button } from '@mui/material'
const CreateBlogForm = ({ handleNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const formStyle = {
    marginBottom: 10,
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
