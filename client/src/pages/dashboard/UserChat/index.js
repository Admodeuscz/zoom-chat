import React, { useEffect, useRef, useState } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import SimpleBar from 'simplebar-react'

import ChatInput from './ChatInput'
import UserHead from './UserHead'

//Import Images
import avatar1 from '../../../assets/images/users/avatar-1.jpg'

//Import Mock Data

//i18n
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import chatApi, { URL_GET_MESSAGES } from '../../../apis/chat.api'
import UserProfileSidebar from '../../../components/UserProfileSidebar'
import useStoreUser from '../../../store/useStoreUser'
import DisplayName from './DisplayName'

function UserChat() {
  const ref = useRef()
  const { t } = useTranslation()

  const [chatMessages, setChatMessages] = useState([])
  const profile = useStoreUser((state) => state.profile)

  const { data: messages } = useQuery({
    queryKey: [URL_GET_MESSAGES],
    queryFn: () => chatApi.getMessages()
  })

  useEffect(() => {
    if (messages) {
      setChatMessages(messages?.data?.data || [])
    }
  }, [messages])

  useEffect(() => {
    if (ref.current) {
      ref.current.recalculate()
      if (ref.current.el) {
        ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight
      }
    }
  }, [chatMessages])

  const addMessage = (message, toUser) => {
    let messageObj = null
    let d = new Date()
    messageObj = {
      message_id: chatMessages.length + 1,
      content: message,
      created_at: d.toISOString(),
      sender_id: profile.op_id,
      receiver_id: toUser,
      parent_message_id: null,
      is_deleted: false,
      sender: profile
    }

    if (messageObj) {
      setChatMessages((prevMessages) => [...prevMessages, messageObj])
    }
    scrollToBottom()
  }

  const scrollToBottom = () => {
    if (ref.current?.el) {
      ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight
    }
  }

  const deleteMessage = (messageId) => {
    setChatMessages((prevMessages) => prevMessages.filter((message) => message.message_id !== messageId))
  }

  const renderMessages = () => {
    return chatMessages.map((message, index) => {
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
