const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog} = require('./helper')


describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.request.post('http://localhost:3003/api/testing/reset')
    
    const testUser = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpassword'
    }

    await page.request.post('http://localhost:3003/api/users', { data: testUser })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const usernameInput = page.getByLabel('Username')
    const passwordInput = page.getByLabel('Password')
    const loginButton = page.getByRole('button', { name: 'Login' })

    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        loginWith(page, 'testuser', 'testpassword')
        await expect(page.getByText('Test User is logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        loginWith(page, 'wronguser', 'wrongpassword')
        await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    loginWith(page, 'testuser', 'testpassword')
  })

  test('a new blog can be created', async ({ page }) => {
    await createBlog(page, 'Test Blog Title', 'Test Blog Author', 'http://testblogurl.com')

    await expect(page.getByText('The blog Test Blog Title by Test Blog Author was added')).toBeVisible()
    await expect(page.getByText('Test Blog Title Test Blog Author')).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    await createBlog(page, 'Test Blog Title', 'Test Blog Author', 'http://testblogurl.com')

    await page.getByRole('button', { name: 'View' }).click()
    await page.getByRole('button', { name: 'Like' }).click()

    await expect(page.getByText('Likes: 1')).toBeVisible()
  })

  test('a blog can be deleted by the user who created it', async ({ page }) => {
    await createBlog(page, 'Test Blog Title', 'Test Blog Author', 'http://testblogurl.com')

    await page.getByRole('button', { name: 'View' }).click()
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Remove' }).click()

    await expect(page.getByText('Test Blog Title Test Blog Author')).not.toBeVisible()
  })

  test('only the user who created a blog can see the delete button', async ({ page }) => {
    await createBlog(page, 'Test Blog Title', 'Test Blog Author', 'http://testblogurl.com')
    await page.getByRole('button', { name: 'Logout' }).click()

    const anotherUser = {
      name: 'Another User',
      username: 'anotheruser',
      password: 'anotherpassword'
    }

    await page.request.post('http://localhost:3003/api/users', { data: anotherUser })

    loginWith(page, 'anotheruser', 'anotherpassword')

    await page.getByRole('button', { name: 'View' }).click()

    await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
  })

  test('blogs are ordered by likes in descending order', async ({ page }) => {
    await createBlog(page, 'First Blog', 'Author 1', 'http://firstblog.com')
    await page.getByRole('button', { name: 'View' }).click()

    await createBlog(page, 'Second Blog', 'Author 2', 'http://secondblog.com')
    await page.getByRole('button', { name: 'View' }).last().click()
    await page.getByRole('button', { name: 'Like' }).last().click()
    await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
    await page.getByRole('button', { name: 'Like' }).first().click()
    await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)

    await createBlog(page, 'Third Blog', 'Author 3', 'http://thirdblog.com')
    await page.getByRole('button', { name: 'View' }).last().click()
    await page.getByRole('button', { name: 'Like' }).last().click()
    await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)

    const blogs = await page.getByText('Blog Author').all()
    await expect(blogs[0]).toContainText('Second Blog Author 2')
    await expect(blogs[1]).toContainText('Third Blog Author 3')
    await expect(blogs[2]).toContainText('First Blog Author 1')

  })
    
})
})