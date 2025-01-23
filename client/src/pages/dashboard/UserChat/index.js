import React, { useCallback, useEffect, useRef } from 'react'
import SimpleBar from 'simplebar-react'

import UserProfileSidebar from '../../../components/UserProfileSidebar'
import ChatInput from './ChatInput'
import EmojiPickerPortal from './EmojiPickerPortal'
import MessageList from './MessageList'
import UserHead from './UserHead'

import { useQuery } from '@tanstack/react-query'
import chatApi, { URL_MESSAGES } from '../../../apis/chat.api'
import useSendMessage from '../../../hooks/api/useSendMessage'
import useStoreChat, { setStoreChat } from '../../../store/useStoreChat'
import useStoreUser from '../../../store/useStoreUser'

const LOAD_MORE_THRESHOLD = 50

const UserChat = () => {
  const ref = useRef()
  const scrollPositionRef = useRef(null)

  const profile = useStoreUser((state) => state?.profile)
  const messages = useStoreChat((state) => state?.messages)
  const previousDay = useStoreChat((state) => state?.previousDay)

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

    const { scrollTop } = element

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

  const { handleAddMessage } = useSendMessage(ref)

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
