import { useAnecdoteActions, useAnecdotes, useNotificationActions} from "../store"

const AnecdoteList = () => {
    const anecdotes = useAnecdotes()
    const {vote, remove} = useAnecdoteActions()
    const {setNotification} = useNotificationActions()

    const handleVote = (anecdote) => {
        vote(anecdote.id)
        setNotification(`You voted '${anecdote.content}'`)
    }

    const handleDelete = (anecdote) => {
        if(window.confirm(`Are you sure you want to remove ${anecdote.content}?`)){
            console.log(`deleting '${anecdote.content}'`)
            remove(anecdote.id)
        }
    }

    return (
        <div>
            {anecdotes.map(anecdote => (
                <div key={anecdote.id}>
                <div>{anecdote.content}</div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => handleVote(anecdote)}>vote</button>
                {anecdote.votes === 0 && 
                    <button onClick={() => handleDelete(anecdote)}>delete</button>}
                </div>
                </div>
            ))}
        </div>
    )
}

export default AnecdoteList