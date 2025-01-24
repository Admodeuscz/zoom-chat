import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import chatApi from '../../apis/chat.api'
import { setStoreChat } from '../../store/useStoreChat'
import useStoreUser from '../../store/useStoreUser'
import { handleScrollBottom } from '../../utils/utils'

export default function useSendMessage(ref = null) {
  const profile = useStoreUser((state) => state?.profile)

  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: (data) => chatApi.sendMessage(data),
  })

  const updateMessages = useCallback((newMessages, shouldPrepend = false) => {
    if (!newMessages) return

    setStoreChat((prev) => {
      if (newMessages?.parent_message_id) {
        const messages = [...prev.messages]
        const parentIndex = messages.findIndex((msg) => msg.message_id === newMessages.parent_message_id)

        if (parentIndex !== -1) {
          messages[parentIndex] = {
            ...messages[parentIndex],
            replies: [...(messages[parentIndex].replies || []), newMessages]
          }
        }

        return { ...prev, messages }
      }

      return {
        ...prev,
        messages: shouldPrepend ? [newMessages, ...(prev?.messages || [])] : [...(prev?.messages || []), newMessages]
      }
    })
  }, [])

  const handleAddMessage = useCallback(
    async (message, toUser, parent_id = null) => {
      const messageObj = {
        content: message,
        receiver_id: toUser?.op_id || null,
        receiver: toUser || null,
        created_at: new Date().toISOString(),
        sender_id: profile.op_id,
        parent_message_id: parent_id,
        sender: profile,
        reactions: JSON.stringify([])
      }

      updateMessages(messageObj)

      const response = await sendMessage({
        content: messageObj.content,
        receiver_id: messageObj.receiver_id,
        parent_id: messageObj.parent_message_id
      })

      if (response?.data?.data?.message_id) {
        messageObj.message_id = response.data.data.message_id
      }

      if (ref?.current && !parent_id) {
        handleScrollBottom(ref)
      }
    },
    [profile, ref, sendMessage, updateMessages]
  )

  return { handleAddMessage }
}
