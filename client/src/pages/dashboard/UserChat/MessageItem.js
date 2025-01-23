import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { genAvatar } from '../../../utils/utils'
import DisplayName from './DisplayName'
import ReactionItem from './ReactionItem'
import ReplyBox from './ReplyBox'

const messageReactionsStyle = {
  display: 'flex',
  marginLeft: '52px',
  gap: '4px'
}

const MessageItem = React.memo(({ currentUser, message, t, isReply = false, index, messages }) => {
  const messageId = message.message_id
  const reactions = useMemo(() => JSON.parse(message?.reactions) || [], [message?.reactions])
  const [showActions, setShowActions] = useState(false)
  const [showReplyBox, setShowReplyBox] = useState(false)
  const actionsRef = useRef(null)
  const profile = useSelector((state) => state.profile)
  const isSender = useMemo(() => message?.sender_id === profile?.op_id, [message?.sender_id, profile?.op_id])

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

  const handleShowReplyBox = useCallback((e) => {
    e.stopPropagation()

    setShowReplyBox((prev) => !prev)
  }, [])

  const formattedTime = useMemo(() => moment(message.created_at).format('hh:mm A'), [message.created_at])

  const isSameMessage = useCallback(() => {
    if (message?.parent_message_id) {
      const parentMessage = messages.find((msg) => msg.message_id === message.parent_message_id)
      if (!parentMessage?.replies?.length) return false

      const repliesMap = new Map(parentMessage.replies.map((reply, index) => [reply.message_id, { reply, index }]))

      const currentReply = repliesMap.get(message.message_id)
      if (!currentReply || currentReply.index === 0) return false

      const prevReply = parentMessage.replies[currentReply.index - 1]
      return prevReply.sender_id === message.sender_id
    }

    return index > 0 && messages[index - 1]?.sender_id === message?.sender_id
  }, [message, messages, index])

  return (
    <div
      className='d-flex flex-column mb-2'
      style={{
        width: 'max-content',
        marginLeft: isReply ? '51.2px' : '0',
        maxWidth: isReply ? '100%' : 'calc(100% - 51.2px)'
      }}
    >
      <div className='conversation-list'>
        {isSameMessage() ? (
          <div style={{ width: '52px' }} />
        ) : (
          <div className='chat-avatar'>
            <div className='avatar-xs'>
              <span className='avatar-title rounded-circle bg-primary-subtle text-primary'>
                {genAvatar(message?.sender?.op_name)}
              </span>
            </div>
          </div>
        )}

        <div className='user-chat-content'>
          <div className='conversation-name'>
            <div>
              <div
                className='user-name'
                style={{
                  gap: '2px'
                }}
              >
                <DisplayName message={message} profile={currentUser} />
              </div>
            </div>
            <span className='chat-time mb-0' style={{ whiteSpace: 'nowrap' }}>
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
                  {!message?.parent_message_id && (
                    <div className='message-actions-item' onClick={handleActionClick(handleShowReplyBox)}>
                      <i className='ri-chat-new-line'></i>
                    </div>
                  )}
                  <div className='message-actions-item' onClick={handleActionClick(handleShowEmoji)}>
                    <i className='ri-emotion-happy-line'></i>
                  </div>
                  <div className='message-actions-item' onClick={handleActionClick(() => {})}>
                    <i className='ri-clipboard-line'></i>
                  </div>
                  {isSender && (
                    <div className='message-actions-item' onClick={handleActionClick(() => {})}>
                      <i className='ri-edit-box-line'></i>
                    </div>
                  )}
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
        <MessageItem
          messages={messages}
          index={index}
          key={replyMessage.message_id}
          currentUser={currentUser}
          message={replyMessage}
          t={t}
          isReply={true}
        />
      ))}
      <ReplyBox messageId={messageId} marginLeft={'51.2px'} expanded={showReplyBox} />
    </div>
  )
})

export default MessageItem
