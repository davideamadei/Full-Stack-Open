import { Container, AppBar, Toolbar, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch,
} from 'react-router-dom'
import { ErrorBoundary, getErrorMessage } from 'react-error-boundary'

import Blog from './components/Blog'
import BlogList from './components/BlogList'
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

  const [notification, setNotification] = useState(null)
  // const [errorMessage, setErrorMessage] = useState(null)
  // const [successMessage, setSuccessMessage] = useState(null)

  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

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

  const handleLogin = async (event) => {
    event.preventDefault(console.log('logging in'))
    try {
      const user = await loginService.login({
        username: username,
        password: password,
      })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({
        text: `Successfully logged in as ${user.name ? user.name : user.username}`,
        type: 'success',
      })
      setTimeout(() => setNotification(null), 5000)
      // setSuccessMessage(`Successfully logged in as ${user.name ? user.name : user.username}`)
      // setTimeout(() => setSuccessMessage(null), 5000)
      navigate('/')
    } catch {
      setNotification({ text: 'Wrong username or password', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
      // setErrorMessage('Wrong username or password')
      // setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLike = async (blog) => {
    if (!user) {
      setNotification({
        text: 'You must be logged in to like posts',
        type: 'error',
      })
      // setErrorMessage('You must be logged in to like posts')
      // setTimeout(() => setErrorMessage(null), 5000)
    }
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    updatedBlog.user = blog.user.id
    const response = await blogService.update(updatedBlog)
    setBlogs(
      blogs
        .map((b) => (b.id === updatedBlog.id ? response : b))
        .sort((a, b) => b.likes - a.likes)
    )
  }

  const handleDelete = async (blog) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${blog.title} by ${blog.author}?`
      )
    ) {
      try {
        await blogService.deleteBlog(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        navigate('/')
      } catch (error) {
        if (error.response) {
          console.log(
            error.response.data,
            error.response.status,
            error.response.headers
          )
        }
      }
    }
  }

  // const blogFormRef = useRef()

  const handleNewBlog = async (event, title, author, url) => {
    event.preventDefault(console.log('creating new blog'))
    try {
      const newBlog = {
        title: title,
        author: author,
        url: url,
      }
      console.log(newBlog)
      const savedBlog = await blogService.createNew(newBlog)
      console.log(savedBlog)
      setNotification({
        text: `The blog ${title} by ${author} was added`,
        type: 'success',
      })
      setTimeout(() => setNotification(null), 5000)
      // setSuccessMessage(`The blog ${title} by ${author} was added`)
      // setTimeout(() => setSuccessMessage(null), 5000)
      setBlogs(blogs.concat(savedBlog))
      navigate('/')
      // if (blogFormRef.current) {
      //   blogFormRef.current.toggleVisibility()
      // }
    } catch (error) {
      if (error.response) {
        if (error.response.data.error.includes('token expired')) {
          setUser(null)
          window.localStorage.clear()
          setNotification({
            text: 'Session expired, please log in again',
            type: 'error',
          })
          setTimeout(() => setNotification(null), 5000)
          // setErrorMessage('Session expired, please log in again')
          // setTimeout(() => setErrorMessage(null), 5000)
          return
        }
      }
      setNotification({ text: 'Failed to create new blog', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
      // setErrorMessage('Failed to create new blog')
      // setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const logout = (notification) => {
    setUser(null)
    window.localStorage.clear()
    setNotification(notification)
    setTimeout(() => setNotification(null), 5000)
    // setMessage(message)
    // setTimeout(() => setMessage(null), 5000)
    navigate('/')
  }

  const buttonStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <h2>Blog App</h2>
          <div style={{ marginLeft: 'auto' }}>
            <Button color="inherit" sx={buttonStyle} component={Link} to="/">
              Blogs
            </Button>
            {user && (
              <Button
                color="inherit"
                sx={buttonStyle}
                component={Link}
                to="/new_blog"
              >
                New Blog
              </Button>
            )}
            {user && (
              <Button
                color="inherit"
                sx={buttonStyle}
                onClick={() =>
                  logout({ text: 'User logged out', type: 'success' })
                }
              >
                Logout
              </Button>
            )}
            {!user && (
              <Button
                color="inherit"
                sx={buttonStyle}
                component={Link}
                to="/login"
              >
                Login
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>

      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => {
          return (
            <div role="alert">
              <p>Something went wrong:</p>
              <pre>{getErrorMessage(error)}</pre>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )
        }}
        onError={(error, info) => {
          console.log(error, ' ', info)
        }}
      >
        <Notification notification={notification} />
        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route
            path="/login"
            element={
              <LoginForm
                handleLogin={handleLogin}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
              />
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                handleLike={handleLike}
                handleDelete={handleDelete}
                user={user}
              />
            }
          />
          <Route
            path="/new_blog"
            element={<CreateBlogForm handleNewBlog={handleNewBlog} />}
          />
          <Route path="/*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
