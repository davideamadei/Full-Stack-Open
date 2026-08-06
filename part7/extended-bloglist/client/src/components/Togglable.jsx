import { useState, useImperativeHandle } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  //   const hideWhenVisible = { display: visible ? 'none' : '' }
  //   const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const isVisible = () => {
    return visible
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility, isVisible }
  })
  if (isVisible()) {
    return (
      <div>
        {props.children}
        <button onClick={toggleVisibility}>{props.hideButtonLabel}</button>
      </div>
    )
  } else {
    return (
      <div>
        <button onClick={toggleVisibility}>{props.showButtonLabel}</button>
      </div>
    )
  }
  //   return (
  //     <div>
  //       <div style={hideWhenVisible}>
  //         <button onClick={toggleVisibility}>{props.buttonLabel}</button>
  //       </div>
  //       <div style={showWhenVisible}>
  //         {props.children}
  //         <button onClick={toggleVisibility}>Cancel</button>
  //       </div>
  //     </div>
  //   )
}

export default Togglable
