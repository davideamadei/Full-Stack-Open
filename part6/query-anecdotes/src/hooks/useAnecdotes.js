import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAnecdotes, createNew, update } from "../requests"

export const useAnecdotes = () => {
  const queryClient = useQueryClient()

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
    }
  })
  
  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
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