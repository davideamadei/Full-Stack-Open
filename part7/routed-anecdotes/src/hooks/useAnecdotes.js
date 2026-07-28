import { useState, useEffect } from "react"
import anecdoteService from '../services/anecdotes'

export const useAnecdotes = () => {
    const [anecdotes, setAnecdotes] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            setAnecdotes(await anecdoteService.getAll())
        }
        fetchData()
    }, [])

    const addAnecdote = async (anecdote) => {
        console.log(anecdotes)
        const newAnecdote = await anecdoteService.createNew(anecdote)
        setAnecdotes(anecdotes.concat(newAnecdote))
    }

    const removeAnecdote = async (anecdote) => {
        if (window.confirm(`Remove anecdote '${anecdote.content}'?`)){
            await anecdoteService.remove(anecdote.id)
            console.log(anecdotes)
            setAnecdotes(anecdotes.filter(a => a.id !== anecdote.id))
        }
    }

    return {
        anecdotes,
        addAnecdote,
        removeAnecdote
    }
}