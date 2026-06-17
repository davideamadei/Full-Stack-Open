const _ = require('lodash')

const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const favorite = blogs.reduce((prev,current) => (prev.likes >= current.likes) ? prev : current)
  return favorite
}

const mostBlogs = (blogs) => {
  const blogCounts = _.countBy(blogs, 'author')

  const result = _.reduce(blogCounts, (result, count, author) => {
    if (count > result.blogs) {
      result.author = author
      result.blogs = count
    }
    return result
  }, {
    'author': null,
    'blogs': 0
  })
  return result.author ? result : null

}

const mostLikes = (blogs) => {
  const authorLikes = {}
  const mostLikedAuthor = {
    'author': null,
    'likes': 0
  }
  _.reduce(blogs, (result, blog) => {
    const author = blog.author
    const likes = blog.likes
    if (result[author]) {
      result[author] += likes
    }
    else {
      result[author] = likes
    }
    if (result[author] > mostLikedAuthor.likes){
      mostLikedAuthor.author = author
      mostLikedAuthor.likes = result[author]
    }
    return result
  }, authorLikes)

  return mostLikedAuthor.author ? mostLikedAuthor : null
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}