import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy; 2025 ABI Team</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by ABI Panel</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
