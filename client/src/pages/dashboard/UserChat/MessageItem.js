import moment from 'moment'
import React, { useState } from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import DisplayName from './DisplayName'
import EmojiPicker from 'emoji-picker-react';

import { genAvatar } from '../../../utils/utils'

const MessageItem = React.memo(({ currentUser, message, t }) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
  }

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
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle
              style={{
                backgroundColor: 'transparent',
                borderRadius: '12px',
                padding: '0',
                fontSize: '12px'
              }}
            >
              <div className='ctext-wrap-content'>
                <p className='mb-0'>{message.content}</p>
              </div>
            </DropdownToggle>
            <DropdownMenu style={{ padding: 0, border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}
            >
              <DropdownItem toggle={false} style={{ padding: 0, border: 'none', borderRadius: '50px', }}>
                <EmojiPicker reactionsDefaultOpen={true} searchDisabled={true} skinTonesDisabled={true} onEmojiClick={(emoji) => {
                  console.log(emoji)
                }} />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
