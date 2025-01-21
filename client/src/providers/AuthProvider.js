import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import authApi from '../apis/auth.api'
import { setStoreUser } from '../store/useStoreUser'

export const AuthProvider = ({ children }) => {
  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me
  })
  useEffect(() => {
    if (data?.data?.data) {
      setStoreUser({ profile: data?.data?.data })
    }
  }, [data])

  return <>{children}</>
}

export default AuthProvider
