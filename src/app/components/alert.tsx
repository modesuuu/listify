import React, { useEffect } from 'react'

const Alert = ({message, onClose}: {message: string, onClose: () => void}) => {
  useEffect(() => {
          const timer = setTimeout(onClose, 3000); 
          return () => clearTimeout(timer);
        });
  return (
    <div className="alert alert-warning z-20 flex items-center gap-4" role="alert">
      <span className="icon-[tabler--alert-triangle] size-6"></span>
      <p><span className="text-lg font-semibold">Warning alert:</span>{message}</p>
    </div>

  )
}

export default Alert