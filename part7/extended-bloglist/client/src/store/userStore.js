import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import loginService from '../services/login'
import blogService from '../services/blogs'
import userService from '../services/persistentUser'
import userListService from '../services/users'

const useUserStore = create(
  devtools((set, get) => ({
    user: null,
    userList: [],
    actions: {
      initialize: async () => {
        const user = await userService.getUser()
        if (user) {
          blogService.setToken(user.token)
          set(() => ({ user: user }))
        }
        const userList = await userListService.getAll()
        set(() => ({ userList: userList }))
      },
      login: async (username, password) => {
        const user = await loginService.login({
          username: username,
          password: password,
        })
        userService.saveUser(user)
        blogService.setToken(user.token)
        set(() => ({ user: user }))
        return user
      },
      logout: () => {
        userService.removeUser()
        set(() => ({ user: null }))
        window.localStorage.clear()
      },
    },
  }))
)

export const useUser = () => useUserStore((state) => state.user)
export const useUserList = () => useUserStore((state) => state.userList)
export const useUserActions = () => useUserStore((state) => state.actions)
