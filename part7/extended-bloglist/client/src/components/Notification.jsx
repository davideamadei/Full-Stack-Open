import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={notification.type}
    >
      {notification.text}
    </Alert>
  )
}

// const Notification = ({ message, isError }) => {
//   const notificationStyle = {
//     'color': isError ? 'red' : 'green',
//     'background': 'lightgrey',
//     'fontSize': '20px',
//     'borderStyle': 'solid',
//     'borderRadius': '5px',
//     'padding': '10px',
//     'marginBottom': '10px'
//   }
//   if (message === null) {
//     return null
//   }
//   return (
//     <div style={notificationStyle}>
//       {message}
//     </div>
//   )
// }

export default Notification
