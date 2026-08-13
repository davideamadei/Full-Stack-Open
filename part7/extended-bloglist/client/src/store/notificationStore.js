import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useNotificationStore = create(
  devtools((set, get) => ({
    notification: null,
    timeoutID: null,
    actions: {
      setNotification: (notification) => {
        set(() => ({ notification: notification }))
        const { timeoutID } = get()
        clearTimeout(timeoutID)
        set(() => ({
          timeoutID: setTimeout(
            () => set(() => ({ notification: null })),
            5000
          ),
        }))
      },
    },
  }))
)

export const useNotification = () =>
  useNotificationStore((state) => state.notification)
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions)
