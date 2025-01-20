import React, { useEffect, useRef, useState } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import SimpleBar from 'simplebar-react'

import ChatInput from './ChatInput'
import UserHead from './UserHead'

//Import Images
import avatar1 from '../../../assets/images/users/avatar-1.jpg'

//Import Mock Data
import { MOCK_MESSAGES, MOCK_USER } from '../../../data/chat.data'

//i18n
import { useTranslation } from 'react-i18next'
import UserProfileSidebar from '../../../components/UserProfileSidebar'
import useStoreUser from '../../../store/useStoreUser'

function UserChat() {
  const ref = useRef()
  const { t } = useTranslation()

  const [chatMessages, setChatMessages] = useState(MOCK_MESSAGES)
  const [currentUser] = useState(MOCK_USER)
  const profile = useStoreUser((state) => state.profile)

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
    var n = d.getSeconds()
    messageObj = {
      id: chatMessages.length + 1,
      message: message,
      time: '00:' + n,
      userType: toUser,
      image: avatar1,
      isFileMessage: false,
      isImageMessage: false
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

  const deleteMessage = (id) => {
    setChatMessages((prevMessages) => prevMessages.filter((message) => message.id !== id))
  }

  return (
    <React.Fragment>
      <div className='user-chat w-100 overflow-hidden'>
        <div className='d-lg-flex'>
          <div className='w-100 overflow-hidden position-relative'>
            <UserHead user={currentUser} />

            <SimpleBar style={{ maxHeight: '100%' }} ref={ref} className='chat-conversation p-5 p-lg-4' id='messages'>
              <ul className='list-unstyled mb-0'>
                {chatMessages.map((chat, key) => (
                  <li key={key}>
                    <div className='conversation-list'>
                      <div className='chat-avatar'>
                        <img src={chat.image} alt='chatting system' />
                      </div>

                      <div className='user-chat-content'>
                        <div className='conversation-name'>
                          <div>
                            <span className='user-name'>{chat.userType === 'sender' ? 'You' : currentUser.name}</span>
                            <span></span>
                          </div>

                          <span className='chat-time mb-0'>
                            <i className='ri-time-line align-middle'></i>{' '}
                            <span className='align-middle'>{chat.time}</span>
                          </span>
                        </div>

                        <div className='ctext-wrap'>
                          <div className='ctext-wrap-content'>
                            {chat.message && <p className='mb-0'>{chat.message}</p>}
                          </div>
                          <UncontrolledDropdown className='align-self-start ms-1'>
                            <DropdownToggle tag='a' className='text-muted'>
                              <i className='ri-more-2-fill'></i>
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem>
                                {t('Copy')} <i className='ri-file-copy-line float-end text-muted'></i>
                              </DropdownItem>
                              <DropdownItem onClick={() => deleteMessage(chat.id)}>
                                Delete <i className='ri-delete-bin-line float-end text-muted'></i>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </SimpleBar>

            <ChatInput onaddMessage={addMessage} />
          </div>
          <UserProfileSidebar user={currentUser} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserChat
