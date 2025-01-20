import React, { useEffect, useRef } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import SimpleBar from 'simplebar-react'

import ChatInput from './ChatInput'
import UserHead from './UserHead'

import avatar1 from '../../../assets/images/users/avatar-1.jpg'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import chatApi, { URL_MESSAGES } from '../../../apis/chat.api'
import UserProfileSidebar from '../../../components/UserProfileSidebar'
import useStoreChat, { setStoreChat } from '../../../store/useStoreChat'
import useStoreUser from '../../../store/useStoreUser'
import DisplayName from './DisplayName'

function UserChat() {
  const ref = useRef()
  const { t } = useTranslation()

  const profile = useStoreUser((state) => state.profile)
  const messages = useStoreChat((state) => state.messages)

  const { mutate: sendMessage } = useMutation({
    mutationFn: (data) => chatApi.sendMessage(data)
  })

  const { data: messagesData } = useQuery({
    queryKey: [URL_MESSAGES],
    queryFn: () => chatApi.getMessages()
  })

  useEffect(() => {
    if (messagesData) {
      setStoreChat({
        messages: messagesData?.data?.data || []
      })
    }
  }, [messagesData])

  useEffect(() => {
    if (ref.current) {
      ref.current.recalculate()
      if (ref.current.el) {
        ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight
      }
    }
  }, [messages])

  const addMessage = (message, toUser) => {
    let messageObj = null
    messageObj = {
      content: message,
      receiver_id: toUser?.op_id || null,
      created_at: new Date().toISOString(),
      sender_id: profile.op_id,
      parent_message_id: null,
      sender: profile
    }
    if (!messageObj) return
    setStoreChat((prev) => ({
      ...prev,
      messages: [...prev.messages, messageObj]
    }))
    sendMessage(
      { content: messageObj.content, receiver_id: messageObj.receiver_id },
      {
        onSuccess: () => {
          scrollToBottom()
        }
      }
    )

    scrollToBottom()
  }

  const scrollToBottom = () => {
    if (ref.current?.el) {
      ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight
    }
  }

  const deleteMessage = (messageId) => {
    setStoreChat((prevMessages) => prevMessages.filter((message) => message.message_id !== messageId))
  }

  const renderMessages = () => {
    return messages.map((message, index) => {
      return (
        <li key={index}>
          <div className='conversation-list'>
            <div className='chat-avatar'>
              <img src={avatar1} alt='chatting system' />
            </div>

            <div className='user-chat-content'>
              <div className='conversation-name'>
                <div>
                  <span className='user-name'>
                    <DisplayName message={message} profile={profile} />
                  </span>
                </div>
                <span className='chat-time mb-0'>
                  <i className='ri-time-line align-middle'></i>{' '}
                  <span className='align-middle'>{new Date(message.created_at).toLocaleTimeString()}</span>
                </span>
              </div>

              <div className='ctext-wrap'>
                <div className='ctext-wrap-content'>
                  <p className='mb-0'>{message.content}</p>
                </div>
                <UncontrolledDropdown className='align-self-start ms-1'>
                  <DropdownToggle tag='a' className='text-muted'>
                    <i className='ri-more-2-fill'></i>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>
                      {t('Copy')} <i className='ri-file-copy-line float-end text-muted'></i>
                    </DropdownItem>
                    <DropdownItem onClick={() => deleteMessage(message.message_id)}>
                      Delete <i className='ri-delete-bin-line float-end text-muted'></i>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </div>
          </div>
        </li>
      )
    })
  }

  return (
    <React.Fragment>
      <div className='user-chat w-100 overflow-hidden'>
        <div className='d-lg-flex'>
          <div className='w-100 overflow-hidden position-relative'>
            <UserHead user={profile} />

            <SimpleBar style={{ maxHeight: '100%' }} ref={ref} className='chat-conversation p-5 p-lg-4' id='messages'>
              <ul className='list-unstyled mb-0'>{renderMessages()}</ul>
            </SimpleBar>

            <ChatInput onaddMessage={addMessage} />
          </div>
          <UserProfileSidebar user={profile} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserChat
