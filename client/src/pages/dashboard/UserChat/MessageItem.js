import moment from 'moment'
import React, { useCallback, useMemo, useRef } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, UncontrolledTooltip } from 'reactstrap'
import { genAvatar } from '../../../utils/utils'
import DisplayName from './DisplayName'

export const showEmojiPickerEvent = new CustomEvent('showEmojiPicker')
export const hideEmojiPickerEvent = new CustomEvent('hideEmojiPicker')

// Tách styles thành constants
const messageReactionsStyle = {
  display: 'flex',
  marginRight: '20px',
  justifyContent: 'flex-end',
  gap: '4px'
}

const reactionItemStyle = {
  backgroundColor: '#f0f2f5',
  padding: '2px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
}

const tooltipStyle = {
  maxWidth: '250px',
  backgroundColor: 'white',
  color: '#333',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  padding: '0'
}

const tooltipContentStyle = {
  maxHeight: '150px',
  overflowY: 'auto',
  padding: '8px 0',
  margin: 0,
  '::-webkit-scrollbar': {
    width: '6px'
  },
  '::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px'
  },
  '::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px'
  }
}

const senderItemStyle = {
  padding: '4px 12px',
  fontSize: '13px',
  whiteSpace: 'nowrap'
}

// Tách component con
const ReactionItem = React.memo(({ reaction, messageId, index }) => {
  const tooltipId = `reaction-${messageId}-${index}`

  return (
    <React.Fragment>
      <span id={tooltipId} className='reaction-item' style={reactionItemStyle}>
        <span>{reaction?.icon}</span>
        {reaction?.senders?.length > 0 && <span style={{ fontWeight: '500' }}>{reaction?.senders?.length}</span>}
      </span>
      <UncontrolledTooltip target={tooltipId} placement='top' className='custom-tooltip' style={tooltipStyle}>
        <style>
          {`
            .custom-tooltip .tooltip-inner {
              background-color: white !important;
              color: #333 !important;
              border: 1px solid #ddd !important;
              border-radius: 8px !important;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
              padding: 0 !important;
            }
            .custom-tooltip .tooltip-arrow {
              display: none !important;
            }
          `}
        </style>
        <div style={tooltipContentStyle}>
          {reaction?.senders?.map((sender, idx) => (
            <div
              key={idx}
              style={{
                ...senderItemStyle,
                borderBottom: idx !== reaction.senders.length - 1 ? '1px solid #eee' : 'none'
              }}
            >
              {sender.op_name}
            </div>
          ))}
        </div>
      </UncontrolledTooltip>
    </React.Fragment>
  )
})

const MessageItem = React.memo(({ currentUser, message, t }) => {
  const contentRef = useRef(null)
  const messageId = message.message_id
  const reactions = useMemo(() => JSON.parse(message?.reactions) || [], [message?.reactions])

  const handleShowEmoji = useCallback(
    (e) => {
      e.stopPropagation()
      const rect = e.target.getBoundingClientRect()

      const showEvent = new CustomEvent('showEmojiPicker', {
        detail: {
          messageId,
          position: {
            x: rect.right - 190,
            y: rect.top - 50
          }
        }
      })
      document.dispatchEvent(showEvent)
    },
    [messageId]
  )

  const formattedTime = useMemo(() => moment(message.created_at).format('hh:mm A'), [message.created_at])

  return (
    <div className='d-flex flex-column mb-2' style={{ width: 'max-content' }}>
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
              <i className='ri-time-line align-middle'></i> {formattedTime}
            </span>
          </div>

          <div className='ctext-wrap'>
            <div className='ctext-wrap-content' ref={contentRef} style={{ cursor: 'pointer' }}>
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
      <div className='message-reactions' style={messageReactionsStyle}>
        {reactions?.map((reaction, index) => (
          <ReactionItem key={`${messageId}-${index}`} reaction={reaction} messageId={messageId} index={index} />
        ))}
      </div>
    </div>
  )
})

export default MessageItem
