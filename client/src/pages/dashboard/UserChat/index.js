import React, { useCallback, useEffect, useRef } from 'react'
import SimpleBar from 'simplebar-react'

import UserProfileSidebar from '../../../components/UserProfileSidebar'
import ChatInput from './ChatInput'
import MessageList from './MessageList'
import UserHead from './UserHead'

import { useMutation, useQuery } from '@tanstack/react-query'
import chatApi, { URL_MESSAGES } from '../../../apis/chat.api'
import useStoreChat, { setStoreChat } from '../../../store/useStoreChat'
import useStoreUser from '../../../store/useStoreUser'

const UserChat = () => {
  const ref = useRef()

  const profile = useStoreUser((state) => state?.profile)
  const messages = useStoreChat((state) => state?.messages)
  const { mutate: sendMessage } = useMutation({
    mutationFn: (data) => chatApi.sendMessage(data)
  })

  const { data: messagesData, isFetching } = useQuery({
    queryKey: [URL_MESSAGES],
    queryFn: () => chatApi.getMessages(),
    gcTime: 0,
    staleTime: 0
  })

  useEffect(() => {
    if (messagesData) {
      setStoreChat({
        messages: messagesData?.data?.data?.reverse() || []
      })
    }
  }, [messagesData])

  useEffect(() => {
    if (ref.current?.el) {
      ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight
    }
  }, [messages])

  const handleAddMessage = useCallback(
    (message, toUser) => {
      const messageObj = {
        content: message,
        receiver_id: toUser?.op_id || null,
        receiver: toUser || null,
        created_at: new Date().toISOString(),
        sender_id: profile.op_id,
        parent_message_id: null,
        sender: profile
      }

      setStoreChat((prev) => ({
        ...prev,
        messages: [...prev.messages, messageObj]
      }))

      sendMessage({ content: messageObj.content, receiver_id: messageObj.receiver_id })
    },
    [profile, sendMessage]
  )

  return (
    <div className='user-chat w-100 overflow-hidden'>
      <div className='d-lg-flex'>
        <div className='w-100 overflow-hidden position-relative'>
          <UserHead user={profile} />

          <SimpleBar style={{ maxHeight: '100%' }} ref={ref} className='chat-conversation p-5 p-lg-4' id='messages'>
            <MessageList messages={messages} isLoading={isFetching} currentUser={profile} />
          </SimpleBar>

          <ChatInput onaddMessage={handleAddMessage} />
        </div>
        <UserProfileSidebar user={profile} />
      </div>
    </div>
  )
}

export default React.memo(UserChat)
