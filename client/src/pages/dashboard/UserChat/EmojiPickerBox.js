import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useRef } from 'react'
import chatApi from '../../../apis/chat.api'
import EmojiPicker from '../../../components/EmojiPicker'
import { setStoreChat } from '../../../store/useStoreChat'
import useStoreUser from '../../../store/useStoreUser'

const EmojiPickerBox = ({ message, isShow, setIsShow, marginLeft }) => {
  const profile = useStoreUser((state) => state?.profile)
  const ref = useRef(null)
  const { mutate: updateEmoji } = useMutation({
    mutationFn: (data) => chatApi.updateEmoji(data)
  })

  const handleUpdateReactionLocal = (messageChecked, emoji) => {
    const reactions = JSON.parse(messageChecked.reactions)
    const reactionIndex = reactions.findIndex((reaction) => reaction.emoji_id === emoji.code)
    if (reactionIndex === -1) {
      reactions.push({
        emoji_id: emoji.code,
        icon: '',
        senders: [{ op_id: profile.op_id, op_name: profile.op_name }]
      })

      return {
        ...messageChecked,
        reactions: JSON.stringify(reactions)
      }
    }
    const hasSender = reactions[reactionIndex].senders.some((sender) => sender.op_id === profile.op_id)
    if (!hasSender) {
      reactions[reactionIndex].senders.push({
        op_id: profile.op_id,
        op_name: profile.op_name
      })

      return {
        ...messageChecked,
        reactions: JSON.stringify(reactions)
      }
    }

    reactions[reactionIndex].senders = reactions[reactionIndex].senders.filter(
      (sender) => sender.op_id !== profile.op_id
    )

    if (reactions[reactionIndex].senders.length === 0) {
      reactions.splice(reactionIndex, 1)
    }

    return {
      ...messageChecked,
      reactions: JSON.stringify(reactions)
    }
  }

  const handleEmojiClick = (emoji) => {
    setIsShow(false)

    setStoreChat((prev) => ({
      ...prev,
      messages: prev.messages.map((prevMessage) => {
        if (prevMessage.message_id === message.message_id) {
          return handleUpdateReactionLocal(prevMessage, emoji)
        }
        return {
          ...prevMessage,
          replies: prevMessage.replies?.map((replyMessage) => {
            if (replyMessage.message_id === message.message_id) {
              return handleUpdateReactionLocal(replyMessage, emoji)
            }
            return replyMessage
          })
        }
      })
    }))

    updateEmoji({
      messageId: message.message_id,
      emoji: {
        emoji_id: emoji.code,
        icon: ''
      }
    })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsShow(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setIsShow])

  return (
    isShow && (
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: marginLeft,
          zIndex: 1000
        }}
        ref={ref}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </div>
    )
  )
}

export default EmojiPickerBox
