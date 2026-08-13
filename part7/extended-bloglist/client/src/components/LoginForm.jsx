import { TextField, Button } from '@mui/material'
import { useState } from 'react'
import { useNotificationActions } from '../store/notificationStore'
import { useUser, useUserActions } from '../store/userStore'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { setNotification } = useNotificationActions()
  const { login } = useUserActions()
  const user = useUser()
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault(console.log('logging in'))
    try {
      const user = await login(username, password)
      setUsername('')
      setPassword('')
      setNotification({
        text: `Successfully logged in as ${user.name ? user.name : user.username}`,
        type: 'success',
      })
      navigate('/')
    } catch (error) {
      console.error(error)
      setNotification({ text: 'Wrong username or password', type: 'error' })
    }
  }

  return (
    <div>
      <h1>Log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            variant="standard"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          <TextField
            label="password"
            variant="standard"
            type="text"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <br />
        <Button type="submit" variant="contained">
          Login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
