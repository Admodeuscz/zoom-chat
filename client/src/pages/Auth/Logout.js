import React from 'react'
import { Navigate } from 'react-router-dom'

//redux store
import useStoreUser, { setStoreUser } from '../../store/useStoreUser'

/**
 * Logouts the user
 * @param {*} props
 */
const Logout = (props) => {
  const isLogged = useStoreUser((state) => state.isLogged)

  // Inside your component
  if (isLogged) {
    setStoreUser({ profile: null, isLogged: false })
    return <Navigate to='/login' />
  }

  document.title = 'Logout | Chatvia React - Responsive Bootstrap 5 Chat App'

  return <React.Fragment></React.Fragment>
}

export default Logout
