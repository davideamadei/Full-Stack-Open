import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const handler = (state, setState) => () => setState(state + 1)

const StatisticsLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}
const Statistics = ({good, neutral, bad}) => {
  if (!good && !neutral && !bad){return <p> No feedback given</p>}

  const total = good + neutral + bad
  const avg = (good - bad) / total
  const positive = good / total * 100  
  return(
    <table>
      <tbody>
        <StatisticsLine text="good" value={good} />
        <StatisticsLine text="neutral" value={neutral} />
        <StatisticsLine text="bad" value={bad} />
        <StatisticsLine text="total" value={total} />
        <StatisticsLine text="average" value={avg} />
        <StatisticsLine text="positive" value={`${positive}%`} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={handler(good, setGood)} text='good' />
      <Button onClick={handler(neutral, setNeutral)} text='neutral' />
      <Button onClick={handler(bad, setBad)} text='bad' />

      <h1>Statistics</h1>
      <Statistics good = {good} neutral = {neutral} bad = {bad} />
    </div>
  )
}

export default App