import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  test('state is initialized with anecdotes returned from backend', async () => {
    const mockAnecdotes = [{ id: 1, content: 'test anecdote', votes: 0 }]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const {result} = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const {result: anecdoteResult} = renderHook(() => useAnecdotes())
    expect(anecdoteResult.current).toEqual(mockAnecdotes)
  })

  test('the anecdotes are returned sorted by number of votes', async () => {
    const anecdotes = [
      { id: 1, content: 'test anecdote', votes: 1 },
      { id: 2, content: 'test anecdote', votes: 21 },
      { id: 3, content: 'test anecdote', votes: 10 },
      { id: 4, content: 'test anecdote', votes: 3 }
    ]
    useAnecdoteStore.setState({
      anecdotes: anecdotes, filter: ''})

    const {result: anecdoteResult} = renderHook(() => useAnecdotes())
    expect(anecdoteResult.current).toEqual(anecdotes.toSorted((a,b) => b.votes - a.votes))
  })

  test('the anecdotes are returned properly filtered', async () => {
    const anecdotes = [
      { id: 1, content: 'filter test', votes: 1 },
      { id: 2, content: 'filter test', votes: 21 },
      { id: 3, content: 'test', votes: 10 }
    ]
    useAnecdoteStore.setState({
      anecdotes: anecdotes, filter: 'filter'})

    const {result: anecdoteResult} = renderHook(() => useAnecdotes())
    expect(anecdoteResult.current).toHaveLength(2)
    expect(anecdoteResult.current).toContain(anecdotes[0])
    expect(anecdoteResult.current).toContain(anecdotes[1])
  })

  test('voting increases the number of votes', async () => {
    const anecdote = {id: 1, content: 'test', votes: 0}
    useAnecdoteStore.setState({
      anecdotes: [anecdote], filter: ''
    })
    
    anecdoteService.update.mockResolvedValue({...anecdote, votes: 1})
    
    const {result} = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.vote(1)
    })

    const {result: anecdoteResult} = renderHook(() => useAnecdotes())
    expect(anecdoteResult.current[0].votes).toBe(1)
  })
})