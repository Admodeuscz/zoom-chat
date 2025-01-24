import { useMutation } from '@tanstack/react-query'
import EmojiPicker from 'emoji-picker-react'
import React from 'react'
import chatApi from '../../../apis/chat.api'
import useStoreUser from '../../../store/useStoreUser'
import { setStoreChat } from '../../../store/useStoreChat'

const EmojiPickerBox = ({ message, isShow, setIsShow, marginLeft }) => {
  const profile = useStoreUser((state) => state?.profile)

  const { mutate: updateEmoji } = useMutation({
    mutationFn: (data) => chatApi.updateEmoji(data)
  })

  const handleUpdateReactionLocal = (messageChecked, emoji) => {
    const reactions = JSON.parse(messageChecked.reactions)
    const reactionIndex = reactions.findIndex((reaction) => reaction.emoji_id === emoji.unified)
    if (reactionIndex === -1) {
      reactions.push({
        emoji_id: emoji.unified,
        icon: emoji.emoji,
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
        emoji_id: emoji.unified,
        icon: emoji.emoji
      }
    })
  }

  return (isShow && <div className='mt-2' style={{ marginLeft }}>
    <EmojiPicker
      reactionsDefaultOpen={true}
      searchDisabled={true}
      skinTonesDisabled={true}
      onEmojiClick={handleEmojiClick}
      lazyLoadEmojis={true}
      allowExpandReactions={false}
    />
  </div>)
}

export default EmojiPickerBox
