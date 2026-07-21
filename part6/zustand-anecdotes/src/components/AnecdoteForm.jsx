import { useAnecdoteActions, useNotificationActions } from "../store"

const AnecdoteForm = () => {
    const {addAnecdote} = useAnecdoteActions()
    const {setNotification} = useNotificationActions()
    const handleNew = e => {
        e.preventDefault()
        const anecdote = e.target.anecdote.value 
        addAnecdote(anecdote)
        setNotification(`Added '${anecdote}' to the list`)
        e.target.reset()
    }

    return (
        <div>
            <h2>Create new</h2>
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