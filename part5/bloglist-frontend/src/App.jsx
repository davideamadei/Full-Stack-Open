import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      const allBlogs = await blogService.getAll()
      setBlogs(allBlogs.sort((a, b) => b.likes - a.likes))
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault(console.log('logging in'))
    try{
      const user = await loginService.login({ 'username': username, 'password': password })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage(`Successfully logged in as ${user.name ? user.name : user.username}`)
      setTimeout(() => setSuccessMessage(null), 5000)
    }
    catch{
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const logout = (message, setMessage) => {
    setUser(null)
    window.localStorage.clear()
    // setTitle('')
    // setAuthor('')
    // setUrl('')
    setMessage(message)
    setTimeout(() => setMessage(null), 5000)
  }

  return (
    <div>
      <Notification message={errorMessage} setMessage={setErrorMessage} isError={true}/>
      <Notification message={successMessage} setMessage={setSuccessMessage} isError={false}/>
      <LoginForm
        handleLogin={handleLogin}user={user}
        username={username} setUsername={setUsername}
        password={password} setPassword={setPassword}
      />

      {user &&
      <div>
        <p>{user.name ? user.name : user.username} is logged in</p>
        <button onClick={() => logout('Logged out', setSuccessMessage)}>Logout</button>
        <Togglable showButtonLabel='Create new blog' hideButtonLabel='Cancel'>
          <CreateBlogForm
            user={user} blogs={blogs} setBlogs={setBlogs}
            setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage}/>
        </Togglable>

        <h2>Blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} user={user} blog={blog} blogs={blogs} setBlogs={setBlogs} />
        )}

      </div>
      }
    </div>
  )
}

export default App