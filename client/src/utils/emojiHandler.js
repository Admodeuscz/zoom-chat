import chatApi from '../apis/chat.api'
import { setStoreChat } from '../store/useStoreChat'

const handleUpdateReactionLocal = (messageChecked, emoji, profile) => {
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

  reactions[reactionIndex].senders = reactions[reactionIndex].senders.filter((sender) => sender.op_id !== profile.op_id)

  if (reactions[reactionIndex].senders.length === 0) {
    reactions.splice(reactionIndex, 1)
  }

  return {
    ...messageChecked,
    reactions: JSON.stringify(reactions)
  }
}

export const handleEmojiClick = (message, emoji, profile, setIsShow = null) => {
  if (setIsShow) {
    setIsShow(false)
  }

  setStoreChat((prev) => ({
    ...prev,
    messages: prev.messages.map((prevMessage) => {
      if (prevMessage.message_id === message.message_id) {
        return handleUpdateReactionLocal(prevMessage, emoji, profile)
      }
      return {
        ...prevMessage,
        replies: prevMessage.replies?.map((replyMessage) => {
          if (replyMessage.message_id === message.message_id) {
            return handleUpdateReactionLocal(replyMessage, emoji, profile)
          }
          return replyMessage
        })
      }
    })
  }))

  chatApi.updateEmoji({
    messageId: message.message_id,
    emoji: {
      emoji_id: emoji.code,
      icon: ''
    }
  })
}
