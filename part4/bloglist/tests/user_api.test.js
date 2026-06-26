const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

// const helper = require('./test_helper')
const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

const initialUsers = helper.initialUsers


describe('When there are already some users saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(initialUsers)
    await Blog.deleteMany({})
  })
  test('all users are retrieved', async () => {
    const response = await api.get('/api/users')
    assert.equal(response.body.length, initialUsers.length)
  })

  describe('Adding a new user', () => {
    test('is successful if the user is valid', async () => {
      const newUser = {
        username: 'paperino',
        name: 'Paperino',
        password: 'password'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAfter = await User.find({})
      assert.strictEqual(usersAfter.length, initialUsers.length + 1)
      const usernames = usersAfter.map(user => user.username)
      assert(usernames.includes(newUser.username))
    })
    test('fails if the username is missing', async () => {
      const newUser = {
        username: 'paperino',
        name: 'Paperino',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    })
    test('fails if the password is missing', async () => {
      const newUser = {
        name: 'Paperino',
        password: 'password'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })

    test('fails if the username is too short', async () => {
      const newUser = {
        username: 'pa',
        name: 'Paperino',
        password: 'password'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })

    test('fails if the password is too short', async () => {
      const newUser = {
        username: 'paperino',
        name: 'Paperino',
        password: 'pa'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })
  })

  test('Saving a new blog creates proper references between user and blog', async () => {
    const user = { username:'paperino', password:'password' }
    const userResponse = await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const authResponse = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blog = helper.initialBlogs[0]

    const response = await api
      .post('/api/blogs')
      .send(blog)
      .set('Authorization', `Bearer ${authResponse.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAfter = await User.findById(userResponse.body.id)
    assert(userResponse.body.blogs.length + 1 === userAfter.blogs.length)
    const blogs = userAfter.blogs.map(blog => blog.toString())
    assert(blogs.includes(response.body.id))
  })

})

after(async () => {
  await mongoose.connection.close()
})