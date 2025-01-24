import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useStoreUser from '../../../store/useStoreUser'
import { genAvatar, getOperatorColor } from '../../../utils/utils'
import DisplayName from './DisplayName'
import EmojiPickerBox from './EmojiPickerBox'
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
  const profile = useStoreUser((state) => state?.profile)
  const isSender = useMemo(() => message?.sender_id === profile?.op_id, [message?.sender_id, profile?.op_id])
  const [isShowRepliesList, setIsShowRepliesList] = useState(false)
  const [isShowEmojiPicker, setIsShowEmojiPicker] = useState(false)

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

  const handleShowEmoji = (e) => {
    e.stopPropagation()
    setIsShowEmojiPicker(true)
  }

  const handleShowReplyBox = (e) => {
    e.stopPropagation()
    if (!showReplyBox) {
      setIsShowRepliesList(true)
    }
    setShowReplyBox((prev) => !prev)
  }

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
      className='d-flex flex-column'
      style={{
        width: 'max-content',
        marginLeft: isReply ? '51.2px' : '0',
        maxWidth: isReply ? '100%' : 'calc(100% - 51.2px)',
        marginBottom: !isSameMessage() ? '8px' : '0'
      }}
    >
      <div className='conversation-list'>
        {isSameMessage() ? (
          <div style={{ width: '52px' }}></div>
        ) : (
          <div className='chat-avatar'>
            <div className='avatar-xs'>
              <span className='avatar-title rounded-circle' style={{ backgroundColor: getOperatorColor(message?.sender) }}>
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
              style={{ cursor: 'pointer', background: getOperatorColor(message?.sender) }}
              onClick={() => {
                setShowActions(!showActions)
                if (isShowEmojiPicker) {
                  setIsShowEmojiPicker(false)
                }
              }}
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
                  <div
                    className='message-actions-item'
                    onClick={handleActionClick(() => {
                      navigator.clipboard.writeText(message.content)
                    })}
                  >
                    <i className='ri-clipboard-line'></i>
                  </div>
                  {isSender && (
                    <div className='message-actions-item' onClick={handleActionClick(() => { })}>
                      <i className='ri-edit-box-line'></i>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Emoji box */}
          <EmojiPickerBox
            message={message}
            marginLeft={'51.2px'}
            isShow={isShowEmojiPicker}
            setIsShow={setIsShowEmojiPicker}
          />
        </div>
      </div>
      <div className='message-reactions' style={messageReactionsStyle}>
        {reactions?.map((reaction, index) => (
          <ReactionItem key={`${messageId}-${index}`} reaction={reaction} messageId={messageId} index={index} />
        ))}
      </div>
      {message.replies?.length > 0 && (
        <div style={{ marginLeft: '51.2px' }}>
          <div
            className='text-primary'
            onClick={() => {
              setIsShowRepliesList((prev) => !prev)
            }}
            style={{ cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {isShowRepliesList ? '返信を非表示' : 'さらに読み込む'}
            {!isShowRepliesList ? <i className='ri-arrow-down-s-line'></i> : <i className='ri-arrow-up-s-line'></i>}
          </div>
        </div>
      )}

      {isShowRepliesList &&
        message.replies?.map((replyMessage, index) => (
          <>
            <MessageItem
              key={replyMessage.message_id}
              currentUser={currentUser}
              message={replyMessage}
              t={t}
              isReply={true}
              messages={messages}
              index={index}
            />
          </>
        ))}
      <ReplyBox messageId={messageId} marginLeft={'51.2px'} expanded={showReplyBox} />
    </div>
  )
})

export default MessageItem
