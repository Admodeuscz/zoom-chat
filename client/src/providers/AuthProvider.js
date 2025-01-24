import React, { useEffect } from 'react'
import { useApiProfile } from '../hooks/api/useApiAuth'
import { setStoreUser } from '../store/useStoreUser'

export const AuthProvider = ({ children }) => {
  const { data, isFetching } = useApiProfile()
  useEffect(() => {
    console.log('>')
    if (data?.data?.data) {
      setStoreUser({ profile: data?.data?.data })
    }
  }, [data, isFetching])

  return <>{children}</>
}

export default AuthProvider
