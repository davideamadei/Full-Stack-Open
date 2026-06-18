const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there are some blogs aready saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are retrieved', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('the unique identifier of each blog is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = await Blog.find()
    assert.strictEqual(response.body[0].id, blogs[0]._id.toString())
  })

  describe('adding a blog', () => {
    test('it is saved correctly', async () => {
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await helper.blogsInDb()
      assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1)
      assert(blogsAfter.find(blog => {
        if (blog.title === newBlog.title  &&
          blog.author === newBlog.author &&
          blog.url === newBlog.url &&
          blog.likes === newBlog.likes)
        {
          return true
        }
        return false
      }))
    })

    test('missing likes they are defaulted to 0', async () => {
      const newBlogMissingLikes = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
      }
      await api
        .post('/api/blogs')
        .send(newBlogMissingLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await helper.blogsInDb()
      assert(blogsAfter.find(blog => {
        if (blog.title === newBlogMissingLikes.title  &&
          blog.author === newBlogMissingLikes.author &&
          blog.url === newBlogMissingLikes.url &&
          blog.likes === 0)
        {
          return true
        }
        return false
      }))
    })


    test('missing likes they are defaulted to 0', async () => {
      const newBlogMissingUrl = {
        title: 'First class tests',
        author: 'Robert C. Martin'
      }
      await api
        .post('/api/blogs')
        .send(newBlogMissingUrl)
        .expect(400)

      const newBlogMissingTitle = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
      }
      await api
        .post('/api/blogs')
        .send(newBlogMissingTitle)
        .expect(400)
    })
  })

  describe('deleting a blog', () => {
    test('succeeds with 204 when it is present', async () => {
      const blogsBefore = await helper.blogsInDb()
      const blogToDelete = blogsBefore[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAfter = await helper.blogsInDb()
      const blogsIds = blogsAfter.map(blog => blog.id)
      assert(! blogsIds.includes(blogToDelete.id))
      assert(blogsAfter.length === blogsBefore.length - 1)
    })

    test('fails with 404 when it is not present', async () => {
      const nonExistingId = await helper.nonExistingId()
      await api
        .delete(`/api/blogs/${nonExistingId}`)
        .expect(404)
    })
  })

  describe('updating the number of likes in a blog', () => {
    test('succeeds with 204 when it is present', async () => {
      const blogs = await helper.blogsInDb()
      const blogToUpdate = blogs[0]

      const likesBefore = blogToUpdate.likes
      blogToUpdate.likes = likesBefore + 1
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)

      const blogsAfter = await helper.blogsInDb()
      assert(blogsAfter.find(blog => {
        if (blog.id === blogToUpdate.id && blog.likes === likesBefore + 1) {
          return true
        }
        return false
      }))
    })

    test('fails with 404 when it is not present', async () => {
      const nonExistingId = await helper.nonExistingId()
      const blogs = await helper.blogsInDb()

      await api
        .put(`/api/blogs/${nonExistingId}`)
        .send(blogs[0])
        .expect(404)
    })
  })
})


after(async () => {
  await mongoose.connection.close()
})