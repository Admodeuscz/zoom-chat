import React, { useCallback, useEffect, useRef, useState } from 'react'
import SimpleBar from 'simplebar-react'

import UserProfileSidebar from '../../../components/UserProfileSidebar'
import ChatInput from './ChatInput'
import MessageList from './MessageList'
import UserHead from './UserHead'

import { useQuery } from '@tanstack/react-query'
import chatApi, { URL_MESSAGES } from '../../../apis/chat.api'
import useSendMessage from '../../../hooks/api/useSendMessage'
import useStoreChat, { setStoreChat } from '../../../store/useStoreChat'
import useStoreUser from '../../../store/useStoreUser'
import { getOperatorColor, handleScrollBottom } from '../../../utils/utils'

const LOAD_MORE_THRESHOLD = 50

const UserChat = () => {
  const ref = useRef()
  const scrollPositionRef = useRef(null)
  const [isScrolled, setIsScrolled] = useState(false)

  const profile = useStoreUser((state) => state?.profile)
  const messages = useStoreChat((state) => state?.messages)
  const previousDay = useStoreChat((state) => state?.previousDay)
  const isShowChat = useStoreChat((state) => state?.isShowChat)
  const isShowMembers = useStoreChat((state) => state?.isShowMembers)
  const onlineUsers = useStoreChat((state) => state?.onlineUsers)

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

    if (!previousDay) {
      setStoreChat((prev) => ({
        ...prev,
        messages: newMessages
      }))
      return;
    }

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
    if (!messagesData?.data?.data?.messages) return

    const newMessages = messagesData.data.data.messages

    if (previousDay) {
      saveScrollPosition()
      updateMessages(newMessages, true)
      restoreScrollPosition()
    } else {
      updateMessages(newMessages)
    }
  }, [messagesData])

  useEffect(() => {
    const scrollElement = ref.current?.getScrollElement()
    if (!scrollElement) return

    scrollElement.addEventListener('scroll', handleScroll)
    return () => scrollElement.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (isScrolled) return
    if (messages?.length > 0) {
      handleScrollBottom(ref)
      setIsScrolled(true)
    }
  }, [messages, isScrolled])

  useEffect(() => {
    console.log(window.Echo);

    return () => {
      setStoreChat((prev) => ({
        ...prev,
        messages: [],
        previousDay: null,
        isShowMembers: false,
        isShowChat: true
      }))
    }
  }, [])

  const { handleAddMessage } = useSendMessage(ref)

  const setHeightMessageBoxStyle = { '--height-message-box': `calc((100vh - 152px) ${isShowMembers ? ' * (4/5)' : ''})` }

  return (
    <div className='user-chat w-100 overflow-hidden'>
      <div className='d-lg-flex'>
        <div className='w-100 overflow-hidden position-relative d-flex flex-column pt-1' style={{ height: '100vh' }}>
          <UserHead user={profile} />

          <div className='d-flex flex-column h-100 user-chat-container'>
            {isShowMembers && (
              <div className='d-flex flex-wrap px-3 py-2 gap-4' style={{ flex: 1 }}>
                {onlineUsers.map((user) => (
                  <div key={user.op_id} style={{
                    borderRadius: '5px',
                    background: getOperatorColor(user),
                    color: 'white',
                    height: '20px',
                    width: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px'
                  }}>
                    {user.op_name}
                  </div>
                ))}
              </div>
            )}
            {isShowChat && (
              <div className='d-flex flex-column chat-conversation-container' style={setHeightMessageBoxStyle}>
                <SimpleBar
                  style={{ maxHeight: '100%', flex: 1 }}
                  ref={ref}
                  className='chat-conversation p-2 p-lg-4'
                  id='messages'
                >
                  <MessageList messages={messages} isLoading={isFetching} currentUser={profile} />
                </SimpleBar>

                <ChatInput onaddMessage={handleAddMessage} />
              </div>
            )}
          </div>
        </div>
        <UserProfileSidebar user={profile} />
      </div>
    </div>
  )
}

export default React.memo(UserChat)
