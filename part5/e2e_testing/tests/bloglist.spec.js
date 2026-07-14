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
    await page.getByText('Login').click()

    const usernameInput = page.getByLabel('Username')
    const passwordInput = page.getByLabel('Password')
    const loginButton = page.getByRole('button', { name: 'Login' })

    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'testuser', 'testpassword')
        await expect(page.getByText('Successfully logged in as Test User')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'wronguser', 'wrongpassword')
        await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    await loginWith(page, 'testuser', 'testpassword')
  })

  test('a new blog can be created', async ({ page }) => {
    await createBlog(page, 'Test Blog Title', 'Test Blog Author', 'http://testblogurl.com')
    // await expect(page.getByText('The blog Test Blog Title by Test Blog Author was added')).toBeVisible()
    await expect(page.getByText('Test Blog Title by Test Blog Author', { exact: true })).toBeVisible()
    // await expect(page.getByRole('listitem').filter({hasText: 'Test Blog Title by Test Blog Author'})).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    await createBlog(page, 'Test Blog Title', 'Test Blog Author', 'http://testblogurl.com')
    await page.getByText('Test Blog Title by Test Blog Author', { exact: true }).click()

    // await page.getByRole('button', { name: 'View' }).click()
    await page.getByRole('button', { name: 'Like' }).click()

    await expect(page.getByText('Likes: 1')).toBeVisible()
  })

  test('a blog can be deleted by the user who created it', async ({ page }) => {
    await createBlog(page, 'Test Blog Title', 'Test Blog Author', 'http://testblogurl.com')
    await page.getByText('Test Blog Title by Test Blog Author', { exact: true }).click()

    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Remove' }).click()

    await expect(page.getByText('Test Blog Title by Test Blog Author', {exact: true})).not.toBeVisible()
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

    await loginWith(page, 'anotheruser', 'anotherpassword')

    await page.getByText('Test Blog Title by Test Blog Author', { exact: true }).click()

    await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
  })

  test('blogs are ordered by likes in descending order', async ({ page }) => {
    await createBlog(page, 'First Blog', 'Author 1', 'http://firstblog.com')

    await createBlog(page, 'Second Blog', 'Author 2', 'http://secondblog.com')
    await page.getByText('Second Blog by Author 2', { exact: true }).click()
    await page.getByRole('button', { name: 'Like' }).click()
    await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)
    await page.getByRole('button', { name: 'Like' }).click()
    await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)

    await createBlog(page, 'Third Blog', 'Author 3', 'http://thirdblog.com')
    await page.getByText('Third Blog by Author 3', { exact: true }).click()
    await page.getByRole('button', { name: 'Like' }).click()
    await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 200)

    await page.getByRole('link', { name: 'Blogs' }).click()
    await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
    const blogs = await expect(page.getByRole('listitem'))
      .toHaveText(['Second Blog by Author 2', 'Third Blog by Author 3', 'First Blog by Author 1'])
  })
    
})
})