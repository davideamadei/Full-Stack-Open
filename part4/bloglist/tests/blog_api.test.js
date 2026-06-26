const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there are some blogs aready saved', () => {
  const addUserAndGetToken =  async user => {
    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const authResponse = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    return authResponse
  }


  beforeEach(async () => {
    await User.deleteMany({})
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

      const authResponse = await addUserAndGetToken({ username: 'davide', password: 'password' })
      const request = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(request)
        .set('Authorization', `Bearer ${authResponse.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await helper.blogsInDb()
      assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1)
      assert(blogsAfter.find(blog => {
        if (blog.title === request.title  &&
          blog.author === request.author &&
          blog.url === request.url &&
          blog.likes === request.likes)
        {
          return true
        }
        return false
      }))
    })

    test('missing likes they are defaulted to 0', async () => {
      const authResponse = await addUserAndGetToken({ username: 'davide', password: 'password' })
      const newBlogMissingLikes = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      }
      await api
        .post('/api/blogs')
        .send(newBlogMissingLikes)
        .set('Authorization', `Bearer ${authResponse.body.token}`)
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


    test('missing url or title fails with 400', async () => {
      const authResponse = await addUserAndGetToken({ username: 'davide', password: 'password' })
      const newBlogMissingUrl = {
        title: 'First class tests',
        author: 'Robert C. Martin',
      }
      await api
        .post('/api/blogs')
        .send(newBlogMissingUrl)
        .set('Authorization', `Bearer ${authResponse.body.token}`)
        .expect(400)

      const newBlogMissingTitle = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      }
      await api
        .post('/api/blogs')
        .send(newBlogMissingTitle)
        .set('Authorization', `Bearer ${authResponse.body.token}`)
        .expect(400)
    })
  })

  describe('deleting a blog', () => {
    test('succeeds with 204 when it is present', async () => {
      const authResponse = await addUserAndGetToken({ username: 'davide', password: 'password' })
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10,
      }

      const blogToDelete = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${authResponse.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      await api
        .delete(`/api/blogs/${blogToDelete.body.id}`)
        .set('Authorization', `Bearer ${authResponse.body.token}`)
        .expect(204)

      const blogsAfter = await helper.blogsInDb()
      const blogsIds = blogsAfter.map(blog => blog.id)
      assert(! blogsIds.includes(blogToDelete.id))
      assert(blogsAfter.length === helper.initialBlogs.length)
    })

    test('fails with 401 when token is missing', async () => {
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })

    test('fails with 404 when it is not present', async () => {
      const authResponse = await addUserAndGetToken({ username: 'davide', password: 'password' })
      const nonExistingId = await helper.nonExistingId()
      await api
        .delete(`/api/blogs/${nonExistingId}`)
        .set('Authorization', `Bearer ${authResponse.body.token}`)
        .expect(404)
    })
  })

  describe('updating the number of likes in a blog', () => {
    test('succeeds with 204 when it is present', async () => {
      const authResponse = await addUserAndGetToken({ username: 'davide', password: 'password' })
      const blogs = await helper.blogsInDb()
      const blogToUpdate = blogs[0]

      const likesBefore = blogToUpdate.likes
      blogToUpdate.likes = likesBefore + 1
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .set('Authorization', `Bearer ${authResponse.body.token}`)
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
      const authResponse = await addUserAndGetToken({ username: 'davide', password: 'password' })
      const nonExistingId = await helper.nonExistingId()
      const blogs = await helper.blogsInDb()

      await api
        .put(`/api/blogs/${nonExistingId}`)
        .send(blogs[0])
        .set('Authorization', `Bearer ${authResponse.body.token}`)
        .expect(404)
    })
  })
})


after(async () => {
  await mongoose.connection.close()
})