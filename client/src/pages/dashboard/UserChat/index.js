import React, { useCallback, useEffect, useRef, useState } from 'react'
import SimpleBar from 'simplebar-react'

import UserProfileSidebar from '../../../components/UserProfileSidebar'
import ChatInput from './ChatInput'
import EmojiPickerPortal from './EmojiPickerPortal'
import MessageList from './MessageList'
import UserHead from './UserHead'

import { useMutation, useQuery } from '@tanstack/react-query'
import chatApi, { URL_MESSAGES } from '../../../apis/chat.api'
import useStoreChat, { setStoreChat } from '../../../store/useStoreChat'
import useStoreUser from '../../../store/useStoreUser'
import { handleScrollBottom } from '../../../utils/utils'

const SCROLL_THRESHOLD = 50
const LOAD_MORE_THRESHOLD = 50

const UserChat = () => {
  const ref = useRef()
  const [isAtBottom, setIsAtBottom] = useState(true)
  const scrollPositionRef = useRef(null)

  const profile = useStoreUser((state) => state?.profile)
  const messages = useStoreChat((state) => state?.messages)
  const previousDay = useStoreChat((state) => state?.previousDay)

  const { mutate: sendMessage } = useMutation({
    mutationFn: (data) => chatApi.sendMessage(data)
  })

  const { data: messagesData, isFetching } = useQuery({
    queryKey: [URL_MESSAGES, previousDay],
    queryFn: () => chatApi.getMessages({ date: previousDay })
  })

  const saveScrollPosition = useCallback(() => {
    const element = ref.current?.getScrollElement()
    if (!element) return

    scrollPositionRef.current = {
      scrollTop: element.scrollTop,
      scrollHeight: element.scrollHeight
    }
  }, [])

  const restoreScrollPosition = useCallback(() => {
    const element = ref.current?.getScrollElement()
    if (!element || !scrollPositionRef.current) return

    requestAnimationFrame(() => {
      const newHeight = element.scrollHeight
      const heightDiff = newHeight - scrollPositionRef.current.scrollHeight
      element.scrollTop = scrollPositionRef.current.scrollTop + heightDiff
      scrollPositionRef.current = null
    })
  }, [])

  const updateMessages = useCallback((newMessages, shouldPrepend = false) => {
    if (!newMessages) return

    setStoreChat((prev) => ({
      ...prev,
      messages: shouldPrepend
        ? [...(newMessages || []), ...(prev?.messages || [])]
        : [...(prev?.messages || []), ...(newMessages || [])]
    }))
  }, [])

  // Handle Loading More Messages
  const handleLoadMore = useCallback(() => {
    if (!messagesData?.data?.data?.previousDay || isFetching) return

    setStoreChat((prev) => ({
      ...prev,
      previousDay: messagesData.data.data.previousDay
    }))
  }, [messagesData, isFetching])

  const handleScroll = useCallback(() => {
    const element = ref.current?.getScrollElement()
    if (!element) return

    const { scrollTop, scrollHeight, clientHeight } = element
    const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < SCROLL_THRESHOLD
    setIsAtBottom(isBottom)

    if (scrollTop < LOAD_MORE_THRESHOLD) {
      handleLoadMore()
    }
  }, [handleLoadMore])

  useEffect(() => {
    if (!messagesData) return

    if (previousDay) {
      saveScrollPosition()
      updateMessages(messagesData.data.data.messages, true)
      restoreScrollPosition()
    } else {
      updateMessages(messagesData.data.data.messages)
    }
  }, [messagesData, previousDay, saveScrollPosition, restoreScrollPosition, updateMessages])

  useEffect(() => {
    const scrollElement = ref.current?.getScrollElement()
    if (!scrollElement) return

    scrollElement.addEventListener('scroll', handleScroll)
    return () => scrollElement.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (isAtBottom && !previousDay) {
      handleScrollBottom(ref)
    }
  }, [messages, isAtBottom, previousDay])

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

      updateMessages([messageObj])
      sendMessage({
        content: messageObj.content,
        receiver_id: messageObj.receiver_id
      })
    },
    [profile, sendMessage, updateMessages]
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
      <EmojiPickerPortal />
    </div>
  )
}

export default React.memo(UserChat)
