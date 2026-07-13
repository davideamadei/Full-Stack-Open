import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test('calls the event handler with the right details when a new blog is created', async () => {
  const mockHandler = vi.fn()
  render(<CreateBlogForm handleNewBlog={mockHandler} />)

  const user = userEvent.setup()
  const titleInput = screen.getByLabelText('Title')
  const authorInput = screen.getByLabelText('Author')
  const urlInput = screen.getByLabelText('URL')
  const createButton = screen.getByText('Create')

  await user.type(titleInput, 'Test Blog Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://test-url.com')
  await user.click(createButton)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][1]).toBe('Test Blog Title')
  expect(mockHandler.mock.calls[0][2]).toBe('Test Author')
  expect(mockHandler.mock.calls[0][3]).toBe('http://test-url.com')
})