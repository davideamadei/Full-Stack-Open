const loginWith = async (page, username, password) => {
//   await page.getByText('Login').click()
//   await page.getByRole('button', { name: 'Login' }).click()
    await page.getByRole('link', { name: 'Login' }).click()
    await page.getByRole('textbox', { name: 'username' }).click();
    await page.getByRole('textbox', { name: 'username' }).fill(username);
    await page.getByRole('textbox', { name: 'password' }).click();
    await page.getByRole('textbox', { name: 'password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
}

const createBlog = async (page, title, author, url) => {
    // await page.getByRole('Button', {name: 'New Blog'}).click()
    await page.getByRole('link', { name: 'New Blog' }).click();
    // await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill(title);
    // await page.getByRole('textbox', { name: 'Author' }).click();
    await page.getByRole('textbox', { name: 'Author' }).fill(author);
    // await page.getByRole('textbox', { name: 'URL' }).click();
    await page.getByRole('textbox', { name: 'URL' }).fill(url);
    await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForResponse(response => response.url().includes('/api/blogs') && response.status() === 201)
}

module.exports = {
  loginWith,
  createBlog
}