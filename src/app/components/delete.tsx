import React from 'react'

const Delete = ({message}: {message: string}) => {
  return (
    <div className="alert z-20 alert-soft alert-error" role="alert">
      Task deleted: {message}
    </div>
  )
}

export default Delete