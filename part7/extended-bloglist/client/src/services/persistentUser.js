const getUser = () => {
  const loggedInUser = window.localStorage.getItem('loggedInUser')
  if (loggedInUser) {
    return JSON.parse(loggedInUser)
  }
  return null
}
const saveUser = (user) => {
  window.localStorage.setItem('loggedInUser', JSON.stringify(user))
}
const removeUser = () => {
  window.localStorage.removeItem('loggedInUser')
}

export default { getUser, saveUser, removeUser }
