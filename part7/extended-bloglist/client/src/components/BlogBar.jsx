import { AppBar, Toolbar, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useUser, useUserActions } from '../store/userStore'
const BlogBar = () => {
  const buttonStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }
  const { logout } = useUserActions()
  const user = useUser()
  return (
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
  )
}

export default BlogBar
