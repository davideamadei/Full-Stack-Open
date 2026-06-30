import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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
      const user = await loginService.login({'username': username, 'password': password})
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
    setTitle('')
    setAuthor('')
    setUrl('')
    setMessage(message)
    setTimeout(() => setMessage(null), 5000)
  }
  
  const handleNewBlog = async event => {
    event.preventDefault(console.log('creating new blog'))
    try{
      const newBlog = {
        'title': title,
        'author': author,
        'url': url
      }
      const savedBlog = await blogService.createNew(newBlog)
      console.log(savedBlog)
      setSuccessMessage(`The blog ${title} by ${author} was added`)
      setTimeout(() => setSuccessMessage(null), 5000)
      setTitle('')
      setAuthor('')
      setUrl('')
      setBlogs(blogs.concat(savedBlog))
    }
    catch(error){
      if (error.response){
        if (error.response.data.error.includes('token expired')){
          logout('Session Expired', setErrorMessage)
          return
        }
      }
      setErrorMessage('Failed to create new blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  

  return (
    <div>
      <Notification message={errorMessage} setMessage={setErrorMessage} isError={true}/>
      <Notification message={successMessage} setMessage={setSuccessMessage} isError={false}/>
      {!user && 
      <div>
        <LoginForm handleLogin={handleLogin}
          username={username} setUsername={setUsername}
          password={password} setPassword={setPassword}
          user={user} setUser={setUser}/>
      </div>
      }

      {user &&
      <div>
        <p>{user.name ? user.name : user.username} is logged in</p>
        <button onClick={()=>logout('Logged out', setSuccessMessage)}>Logout</button>

        <CreateBlogForm handleNewBlog={handleNewBlog}
        title={title} setTitle={setTitle}
        author={author} setAuthor={setAuthor}
        url={url} setUrl={setUrl}/>

        <h2>Blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}

      </div>
      }
    </div>
  )
}

export default App