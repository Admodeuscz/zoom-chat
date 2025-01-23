import { useMutation } from '@tanstack/react-query'
import EmojiPicker from 'emoji-picker-react'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import chatApi from '../../../apis/chat.api'
import { setStoreChat } from '../../../store/useStoreChat'
import useStoreUser from '../../../store/useStoreUser'

const EmojiPickerPortal = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [activeMessageId, setActiveMessageId] = useState(null)
  const portalRef = useRef(null)

  const profile = useStoreUser((state) => state?.profile)

  const { mutate: updateEmoji } = useMutation({
    mutationFn: (data) => chatApi.updateEmoji(data)
  })

  useEffect(() => {
    const portalContainer = document.createElement('div')
    portalContainer.id = 'emoji-picker-portal'
    document.body.appendChild(portalContainer)
    portalRef.current = portalContainer

    return () => {
      document.body.removeChild(portalContainer)
    }
  }, [])

  useEffect(() => {
    const handleShowPicker = (event) => {
      const { messageId, position } = event.detail
      setPosition(position)
      setActiveMessageId(messageId)
      setIsVisible(true)
    }

    const handleClickOutside = (event) => {
      if (portalRef.current && !portalRef.current.contains(event.target)) {
        setIsVisible(false)
        setActiveMessageId(null)
      }
    }

    document.addEventListener('showEmojiPicker', handleShowPicker)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('showEmojiPicker', handleShowPicker)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleEmojiClick = (emoji) => {
    setIsVisible(false)
    setActiveMessageId(null)
    setStoreChat((prev) => ({
      ...prev,
      messages: prev.messages.map((message) => {
        if (message.message_id === activeMessageId) {
          const reactions = JSON.parse(message.reactions)
          const reactionIndex = reactions.findIndex((reaction) => reaction.emoji_id === emoji.unified)
          if (reactionIndex === -1) {
            reactions.push({
              emoji_id: emoji.unified,
              icon: emoji.emoji,
              senders: [profile.op_id]
            })
          } else {
            // kiểm tra nếu có profile.op_id trong senders thì xóa nó không thì thêm nó
            const hasSender = reactions[reactionIndex].senders.some((sender) => sender === profile.op_id)
            if (hasSender) {
              reactions[reactionIndex].senders = reactions[reactionIndex].senders.filter(
                (sender) => sender !== profile.op_id
              )
            } else {
              reactions[reactionIndex].senders.push({
                op_id: profile.op_id,
                op_name: profile.op_name
              })
            }
            if (reactions[reactionIndex].senders.length === 0) {
              reactions.splice(reactionIndex, 1)
            }
          }

          return {
            ...message,
            reactions: JSON.stringify(reactions)
          }
        }
        return message
      })
    }))

    updateEmoji({
      messageId: activeMessageId,
      emoji: {
        emoji_id: emoji.unified,
        icon: emoji.emoji
      }
    })
  }

  if (!portalRef.current) return null

  const style = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 9999,
    visibility: isVisible ? 'visible' : 'hidden',
    opacity: isVisible ? 1 : 0,
    transition: 'visibility 0s, opacity 0.2s linear'
  }

  return createPortal(
    <div style={style}>
      <EmojiPicker
        reactionsDefaultOpen={true}
        searchDisabled={true}
        skinTonesDisabled={true}
        onEmojiClick={handleEmojiClick}
        lazyLoadEmojis={true}
        allowExpandReactions={false}
        reactions={['1f44d', '2764-fe0f', '1f603', '1f622', '1f44e', '1f621']}
        emojiStyle='native'
        style={{
          '--epr-emoji-size': '20px'
        }}
      />
    </div>,
    portalRef.current
  )
}

export default EmojiPickerPortal
