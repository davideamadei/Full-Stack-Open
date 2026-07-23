import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAnecdotes, createNew, update } from "../requests"
import useNotification from "./useNotification"

export const useAnecdotes = () => {
  const queryClient = useQueryClient()

  const {notify} = useNotification()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 2
  })

  const voteMutation = useMutation({
    mutationFn: update,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], 
        anecdotes.map(a => a.id === updatedAnecdote.id ? updatedAnecdote: a))
      notify(`'${updatedAnecdote.content}' was voted`)
    }
  })
  
  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      notify(`The anecdote '${newAnecdote.content}' was added`)
    },
    onError: (error) => {
      notify(error.message)
    }
  })
  
  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,
    addAnecdote: (content) => newAnecdoteMutation.mutate({content: content, votes: 0}),
    addVote: (anecdote) => voteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
  }
}