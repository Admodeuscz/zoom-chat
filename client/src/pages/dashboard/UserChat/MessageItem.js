import moment from 'moment'
import React, { useCallback, useRef } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import { genAvatar } from '../../../utils/utils'
import DisplayName from './DisplayName'

export const showEmojiPickerEvent = new CustomEvent('showEmojiPicker')
export const hideEmojiPickerEvent = new CustomEvent('hideEmojiPicker')

const MessageItem = React.memo(({ currentUser, message, t }) => {
  const contentRef = useRef(null)
  const messageId = message.message_id
  const reactions = JSON.parse(message?.reactions) || []

  const handleShowEmoji = useCallback(
    (e) => {
      e.stopPropagation()
      const rect = e.target.getBoundingClientRect()

      const showEvent = new CustomEvent('showEmojiPicker', {
        detail: {
          messageId,
          position: {
            x: rect.left,
            y: rect.top - 10
          }
        }
      })
      document.dispatchEvent(showEvent)
    },
    [messageId]
  )

  return (
    <div className='d-flex flex-column align-items-end mb-2'>
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
            <div className='ctext-wrap-content' ref={contentRef}>
              <p className='mb-0' onClick={handleShowEmoji}>
                {message.content}
              </p>
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
      <div className='message-reactions'>
        {reactions?.map((reaction, index) => {
          return (
            <span key={index} className='reaction-item'>
              {reaction.icon}
            </span>
          )
        })}
      </div>
    </div>
  )
})

export default MessageItem
