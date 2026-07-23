import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {
  const {anecdotes, isPending, isError, error, addVote} = useAnecdotes()
  

  const handleVote = (anecdote) => {
    console.log('vote')
    addVote(anecdote)
  }
  
  if (isPending) {
    return (<div>loading anecdotes...</div>)
  }

  if (isError) {
    return (<div>{error.message}</div>)
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App