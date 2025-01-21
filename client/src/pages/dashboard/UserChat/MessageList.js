import React from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'

import { useTranslation } from 'react-i18next'
import avatar1 from '../../../assets/images/users/avatar-1.jpg'
import useStoreChat from '../../../store/useStoreChat'
import DisplayName from './DisplayName'

const MessageItem = React.memo(({ currentUser, message, t }) => {
  return (
    <div className='conversation-list'>
      <div className='chat-avatar'>
        <img src={avatar1} alt='chatting system' />
      </div>

      <div className='user-chat-content'>
        <div className='conversation-name'>
          <div>
            <span className='user-name'>
              <DisplayName message={message} profile={currentUser} />
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
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    </div>
  )
})

const MessageList = ({ isLoading, currentUser }) => {
  const { t } = useTranslation()

  const messages = useStoreChat((state) => state.messages)
  if (isLoading || messages.length === 0) return null

  return (
    <ul className='list-unstyled mb-0'>
      {messages.map((message, index) => (
        <li key={index}>
          <MessageItem message={message} currentUser={currentUser} t={t} />
        </li>
      ))}
    </ul>
  )
}

export default React.memo(MessageList)
