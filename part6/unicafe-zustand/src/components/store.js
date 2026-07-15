import { create } from 'zustand'

const useFeedbackStore = create(set => ({
  values:{
    good: 0,
    neutral: 0,
    bad: 0
  },

  controls:{
    addGood: () => set(state => ({values: {...state.values, good: state.values.good + 1}})),
    addNeutral: () => set(state => ({values: {...state.values, neutral: state.values.neutral + 1}})),
    addBad: () => set(state => ({values: {...state.values, bad: state.values.bad + 1}}))
  }
}))

// the hook functions that are used elsewhere in app
export const useFeedbackValues = () => useFeedbackStore(state => state.values)
export const useFeedBackControls = () => useFeedbackStore(state => state.controls)