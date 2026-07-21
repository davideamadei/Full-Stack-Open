
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { devtools } from 'zustand/middleware'
import anecdoteService from "./services/anecdotes"

const useAnecdoteStore = create(devtools((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({anecdotes: anecdotes}))
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
})))

export default useAnecdoteStore
export const useAnecdotes = () => useAnecdoteStore(useShallow(({anecdotes, filter}) => {
  return anecdotes.filter(a => a.content.includes(filter)).toSorted((a, b) => b.votes - a.votes)
}))
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)


const useNotificationStore = create(devtools((set) => ({
  notification: '',
  actions: {
    setNotification: notification => {
      set(() => ({notification: notification}))
      setTimeout(() => set(() => ({notification: ''})), 5000)
    }
  }
})))

export const useNotification = () => useNotificationStore((state => state.notification))
export const useNotificationActions = () => useNotificationStore(state => state.actions)