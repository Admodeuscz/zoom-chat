import { useMutation } from '@tanstack/react-query'
import EmojiPicker from 'emoji-picker-react'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import chatApi from '../../../apis/chat.api'
import useStoreChat, { setStoreChat } from '../../../store/useStoreChat'
import useStoreUser from '../../../store/useStoreUser'

const EmojiPickerPortal = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [activeMessageId, setActiveMessageId] = useState(null)
  const portalRef = useRef(null)

  const profile = useStoreUser((state) => state?.profile)
  const messages = useStoreChat((state) => state?.messages)

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
              reactions[reactionIndex].senders.push(profile.op_id)
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

  if (!isVisible || !portalRef.current) return null

  const style = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 9999
  }

  return createPortal(
    <div style={style}>
      <EmojiPicker
        reactionsDefaultOpen={true}
        searchDisabled={true}
        skinTonesDisabled={true}
        onEmojiClick={handleEmojiClick}
        emojiStyle='native'
        lazyLoadEmojis={true}
      />
    </div>,
    portalRef.current
  )
}

export default EmojiPickerPortal