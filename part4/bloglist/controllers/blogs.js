const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { 'username': 1, 'name': 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(400).send({ error: 'userId is missing or is not valid' })
  }

  const blog = new Blog({ ...body, user: user._id })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const result = await Blog.findById(request.params.id)

  if (!result){
    response.status(404).end()
  }

  if (result.user.toString() === request.user.id.toString()){
    const user = request.user
    user.blogs = user.blogs.filter(blog => blog.toString() !== request.params.id)
    await user.save()
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  else {
    response.status(403).end()
  }

})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    response.status(404).end()
  }
  else{
    blog.likes = likes
    const updatedBlog = await blog.save()
    response.send(updatedBlog)
  }
})

module.exports = blogsRouter