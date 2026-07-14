import { Link } from 'react-router-dom'
import Blog from './Blog'

const BlogList = ({ blogs }) => {
  return(
    <div>
      <h1>Blogs</h1>
      <ul>
        {blogs.map(blog =>
          <li key={blog.id} style={{ fontSize:20 }}><Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}<br/></Link></li>
        )}
      </ul>
    </div>
  )
}

export default BlogList