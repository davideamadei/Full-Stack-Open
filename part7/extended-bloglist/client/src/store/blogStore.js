import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import blogService from '../services/blogs'

const useBlogStore = create(
  devtools((set, get) => ({
    blogs: [],
    actions: {
      initialize: async () => {
        const blogs = await blogService.getAll()
        set(() => ({ blogs: blogs.sort((a, b) => b.likes - a.likes) }))
      },
      addBlog: async (blog) => {
        const newBlog = await blogService.createNew(blog)
        set((state) => ({
          blogs: [...state.blogs, newBlog],
        }))
      },
      updateBlog: async (updatedBlog) => {
        const newBlog = await blogService.update(updatedBlog)
        set((state) => ({
          blogs: state.blogs
            .map((blog) => (blog.id === newBlog.id ? newBlog : blog))
            .sort((a, b) => b.likes - a.likes),
        }))
      },
      deleteBlog: async (blogId) => {
        await blogService.deleteBlog(blogId)
        set((state) => ({
          blogs: state.blogs.filter((blog) => blog.id !== blogId),
        }))
      },
    },
  }))
)

export const useBlog = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)
