import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { genAvatar } from '../../../utils/utils'
import DisplayName from './DisplayName'
import ReactionItem from './ReactionItem'
import ReplyBox from './ReplyBox'

export const showEmojiPickerEvent = new CustomEvent('showEmojiPicker')
export const hideEmojiPickerEvent = new CustomEvent('hideEmojiPicker')
const messageReactionsStyle = {
  display: 'flex',
  marginRight: '20px',
  justifyContent: 'flex-end',
  gap: '4px'
}

const MessageItem = React.memo(({ currentUser, message, t, isReply = false }) => {
  const messageId = message.message_id
  const reactions = useMemo(() => JSON.parse(message?.reactions) || [], [message?.reactions])
  const [showActions, setShowActions] = useState(false)
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [replyBoxLeft, setReplyBoxLeft] = useState(0)
  const actionsRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleActionClick = useCallback(
    (callback) => (e) => {
      e.stopPropagation()
      callback(e)
      setShowActions(false)
    },
    []
  )

  const handleShowEmoji = useCallback(
    (e) => {
      e.stopPropagation()
      const rect = e.target.getBoundingClientRect()

      const showEvent = new CustomEvent('showEmojiPicker', {
        detail: {
          messageId,
          position: {
            x: rect.left - 30,
            y: rect.top - 50
          }
        }
      })
      document.dispatchEvent(showEvent)
    },
    [messageId]
  )

  const handleShowReplyBox = useCallback(
    (e) => {
      e.stopPropagation()

      setReplyBoxLeft(e.target.offsetLeft)
      setShowReplyBox(true)
    },
    []
  )

  const formattedTime = useMemo(() => moment(message.created_at).format('hh:mm A'), [message.created_at])

  return (
    <div className='d-flex flex-column mb-2' style={{ width: 'max-content', marginLeft: isReply ? '51.2px' : '0' }}>
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
            <div
              className='ctext-wrap-content'
              style={{ cursor: 'pointer' }}
              onClick={() => setShowActions(!showActions)}
            >
              <p className='mb-0'>{message.content}</p>

              {showActions && (
                <div className='message-actions' ref={actionsRef}>
                  <div className='message-actions-item' onClick={handleActionClick(handleShowReplyBox)}>
                    <i className='ri-chat-new-line'></i>
                  </div>
                  <div className='message-actions-item' onClick={handleActionClick(handleShowEmoji)}>
                    <i className='ri-emotion-happy-line'></i>
                  </div>
                  <div className='message-actions-item' onClick={handleActionClick(() => { })}>
                    <i className='ri-clipboard-line'></i>
                  </div>
                  <div className='message-actions-item' onClick={handleActionClick(() => { })}>
                    <i className='ri-edit-box-line'></i>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='message-reactions' style={messageReactionsStyle}>
        {reactions?.map((reaction, index) => (
          <ReactionItem key={`${messageId}-${index}`} reaction={reaction} messageId={messageId} index={index} />
        ))}
      </div>
      {message.replies?.map((replyMessage) => (
        <MessageItem key={replyMessage.message_id} currentUser={currentUser} message={replyMessage} t={t} isReply={true} />
      ))}

      {showReplyBox && <ReplyBox messageId={messageId} marginLeft={'51.2px'} />}
    </div>
  )
})

export default MessageItem
