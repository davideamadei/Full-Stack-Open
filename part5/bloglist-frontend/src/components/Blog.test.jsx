import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const testBlog = {
  title: 'Test Blog Title',
  author: 'Test Author',
  url: 'http://test-url.com',
  likes: 5,
  user: {
    username: 'testUser',
    name: 'Test User'
  }
}

const testUser = {
  username: 'testUser',
  name: 'Test User'
}

test('renders Blog with additional information hidden by default', () => {
  const { container } = render(<Blog blog={testBlog} user={testUser} />)
  const baseInfo = screen.getByText(`${testBlog.title} ${testBlog.author}`)
  expect(baseInfo).toBeDefined()

  const extraInfo = container.querySelector('.extra-info')
  expect(extraInfo).toHaveStyle('display: none')
})

test('renders Blog with additional information visible when "View" button is clicked', async () => {
  const { container } = render(<Blog blog={testBlog} user={testUser} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  const extraInfo = container.querySelector('.extra-info')
  expect(extraInfo).not.toHaveStyle('display: none')
  const url = screen.getByText(testBlog.url, { exact: false })
  expect(url).toBeDefined()
  const likes = screen.getByText(`${testBlog.likes} likes`, { exact: false })
  expect(likes).toBeDefined()
  const userName = screen.getByText(testBlog.user.name, { exact: false })
  expect(userName).toBeDefined()
})

test('calls the like handler twice when the "Like" button is clicked twice', async () => {
  const mockHandler = vi.fn()
  render(<Blog blog={testBlog} user={testUser} handleLike={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
