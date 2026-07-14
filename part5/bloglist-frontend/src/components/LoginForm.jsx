import { TextField, Button } from '@mui/material'

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {

  return(
    <div>
      <h1>Log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label='username'
            variant='standard'
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          <TextField
            label='password'
            variant='standard'
            type="text"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <br/>
        <Button type='submit' variant='contained'>Login</Button>
      </form>
    </div>
  )
}

export default LoginForm