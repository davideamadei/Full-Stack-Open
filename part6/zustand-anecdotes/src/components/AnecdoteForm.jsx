import { useAnecdoteActions } from "../store"

const AnecdoteForm = () => {
    const {addAnecdote} = useAnecdoteActions()

    const handleNew = e => {
        e.preventDefault()
        const anecdote = {
        content: e.target.anecdote.value,
        id: (100000 * Math.random()),
        votes: 0
        }
        addAnecdote(anecdote)
        
        e.target.reset()
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={handleNew}>
                <div>
                <input name='anecdote'/>
                </div>
                <button type='submit'>create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm