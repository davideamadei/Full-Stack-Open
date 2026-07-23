import { useContext } from "react"
import NotificationContext from "../components/NotificationContext"

const useNotification = () => useContext(NotificationContext)

export default useNotification