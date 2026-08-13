import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import loginService from '../services/login'
import blogService from '../services/blogs'

const useUserStore = create(
  devtools((set, get) => ({
    user: null,
    actions: {
      initialize: () => {
        const loggedInUser = window.localStorage.getItem('loggedInUser')
        if (loggedInUser) {
          const user = JSON.parse(loggedInUser)
          blogService.setToken(user.token)
          set(() => ({ user: user }))
        }
      },
      login: async (username, password) => {
        const user = await loginService.login({
          username: username,
          password: password,
        })
        window.localStorage.setItem('loggedInUser', JSON.stringify(user))
        blogService.setToken(user.token)
        set(() => ({ user: user }))
        return user
      },
      logout: () => {
        set(() => ({ user: null }))
        window.localStorage.clear()
      },
    },
  }))
)

export const useUser = () => useUserStore((state) => state.user)
export const useUserActions = () => useUserStore((state) => state.actions)
