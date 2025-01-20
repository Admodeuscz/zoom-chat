import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import chatApi from '../apis/chat.api'
import { setStoreChat } from '../store/useStoreChat'

export const ChatProvider = ({ children }) => {
  const { data } = useQuery({
    queryKey: ['members'],
    queryFn: chatApi.getAllMemeber
  })
  useEffect(() => {
    if (data?.data) {
      setStoreChat({ members: data?.data })
    }
  }, [data?.data])

  return <>{children}</>
}

export default ChatProvider
