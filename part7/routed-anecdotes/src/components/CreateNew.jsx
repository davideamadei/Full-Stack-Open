import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'
import { useAnecdotes } from '../hooks/useAnecdotes'

const CreateNew = () => {
  const {addAnecdote} = useAnecdotes()

  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const navigate = useNavigate()

  const resetForm = () => {
    console.log(content)
    content.reset()
    author.reset()
    info.reset()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addAnecdote({ content:content.value, author:author.value, info:info.value, votes: 0 })
    navigate('/')
  }
  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' {...{...content, reset:null}} />
        </div>
        <div>
          author
          <input name='author' {...{...author, reset:null}} />
        </div>
        <div>
          url for more info
          <input name='info' {...{...info, reset:null}}  />
        </div>
        <button>create</button><button type='button' onClick={resetForm}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
