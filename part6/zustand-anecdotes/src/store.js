
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import anecdoteService from "./service/anecdotes"

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({anecdotes: anecdotes
          .toSorted((a, b) => b.votes - a.votes)}))
    },
    vote: async id => {
      const anecdote = get().anecdotes.find(n => n.id === id)
      const updated = await anecdoteService.update(
        id, {...anecdote, votes: anecdote.votes + 1}
      )
      set(
      state => ({
        anecdotes: state.anecdotes
          .map(a => a.id === id ? updated : a)
          .toSorted((a, b) => b.votes - a.votes)
      })
    )},
    remove: async id => {
      await anecdoteService.remove(id)
      set(state => ({anecdotes: state.anecdotes.filter(a => a.id !== id)}))
    },
    addAnecdote: async content => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({anecdotes: state.anecdotes.concat(newAnecdote)}))
    },
    updateFilter: filter => set(() => ({filter: filter}))
  },
}))

export const useAnecdotes = () => useAnecdoteStore(useShallow(({anecdotes, filter}) => {
  return anecdotes.filter(a => a.content.includes(filter))
}))
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

const useNotificationStore = create((set) => ({
  notification: '',
  actions: {
    setNotification: notification => {
      set(() => ({notification: notification}))
      setTimeout(() => set(() => ({notification: ''})), 5000)
    }
  }
}))

export const useNotification = () => useNotificationStore((state => state.notification))
export const useNotificationActions = () => useNotificationStore(state => state.actions)