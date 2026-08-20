import { Container } from '@mui/material'
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useMatch } from 'react-router-dom'
import { ErrorBoundary, getErrorMessage } from 'react-error-boundary'

import BlogBar from './components/BlogBar'

import BlogList from './components/BlogList'
import Blog from './components/Blog'

import UserList from './components/UserList'
import User from './components/User'

import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'

import Notification from './components/Notification'

import {
  useNotification,
  useNotificationActions,
} from './store/notificationStore'

import { useBlog, useBlogActions } from './store/blogStore'
import { useUserList } from './store/userStore'
import { useUserActions } from './store/userStore'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const notification = useNotification()
  const { setNotification } = useNotificationActions()

  const { initialize: blogInitialize, addBlog } = useBlogActions()
  const { initialize: userInitialize } = useUserActions()
  const navigate = useNavigate()

  const blogs = useBlog()
  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null

  const userList = useUserList()
  const userMatch = useMatch('/users/:id')
  const user = userMatch
    ? userList.find((user) => user.id === userMatch.params.id)
    : null

  useEffect(() => {
    blogInitialize()
    userInitialize()
  }, [blogInitialize, userInitialize])

  return (
    <Container>
      <BlogBar />

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
          <Route path="/" element={<BlogList />} />
          <Route path="/blogs/:id" element={<Blog blog={blog} />} />

          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<User user={user} />} />

          <Route path="/login" element={user ? <BlogList /> : <LoginForm />} />
          <Route path="/new_blog" element={<CreateBlogForm />} />

          <Route path="/*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
