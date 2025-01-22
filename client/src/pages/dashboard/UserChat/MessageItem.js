import moment from 'moment'
import React from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import DisplayName from './DisplayName'

import { genAvatar } from '../../../utils/utils'

const MessageItem = React.memo(({ currentUser, message, t }) => {
  return (
    <div className='conversation-list'>
      <div className='chat-avatar'>
        <div className='avatar-xs'>
          <span className='avatar-title rounded-circle bg-primary-subtle text-primary'>
            {genAvatar(message?.sender?.op_name)}
          </span>
        </div>
      </div>

      <div className='user-chat-content'>
        <div className='conversation-name'>
          <div>
            <span className='user-name'>
              <DisplayName message={message} profile={currentUser} />
            </span>
          </div>
          <span className='chat-time mb-0'>
            <i className='ri-time-line align-middle'></i> {moment(message.created_at).format('hh:mm A')}
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

export default MessageItem
