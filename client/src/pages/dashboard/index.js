import Echo from 'laravel-echo'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import ChatProvider from '../../providers/ChatProvider'
import ChatLeftSidebar from './ChatLeftSidebar'
import UserChat from './UserChat/index'

import Pusher from 'pusher-js'
import { setStoreChat } from '../../store/useStoreChat'
import useStoreUser from '../../store/useStoreUser'
import http from '../../utils/http'
const DashboardPage = (props) => {
  const profile = useStoreUser((state) => state?.profile)
  const isLogged = useStoreUser((state) => state?.isLogged)

  const isSender = (message) => {
    return message.sender_id === profile?.op_id
  }

  const handleUpdateMessage = (message, type) => {
    if (isSender(message)) return

    setStoreChat((prev) => ({
      ...prev,
      messages: prev.messages.map((m) => {
        if (m.message_id === message.message_id) {
          if (type === 'REACTIONS') {
            return {
              ...m,
              reactions: message.reactions
            }
          }
          return {
            ...m,
            content: message.content
          }
        }
        return m
      })
    }))
  }

  useEffect(() => {
    window.Pusher = Pusher

    window.Echo = new Echo({
      broadcaster: 'reverb',
      key: process.env.REACT_APP_PUSHER_APP_KEY,
      wsHost: process.env.REACT_APP_PUSHER_APP_HOST,
      wsPort: process.env.REACT_APP_PUSHER_APP_PORT,
      forceTLS: (process.env.REACT_APP_PUSHER_APP_SCHEME ?? 'https') === 'https',
      enabledTransports: ['ws', 'wss'],
      authorizer: (channel, options) => {
        return {
          authorize: (socketId, callback) => {
            http
              .post('/broadcasting/auth', {
                socket_id: socketId,
                channel_name: channel.name
              })
              .then((response) => {
                callback(false, response.data)
              })
              .catch((error) => {
                callback(true, error)
              })
          }
        }
      }
    })

    window.Echo.join('group-chat')
      .here((users) => {
        setStoreChat((prev) => ({
          ...prev,
          onlineUsers: users ? users.filter((user) => user.op_id !== profile?.op_id) : []
        }))
      })
      .joining((user) => {
        setStoreChat((prev) => ({
          ...prev,
          onlineUsers: [...(prev?.onlineUsers || []), user]
        }))
      })
      .leaving((user) => {
        setStoreChat((prev) => ({
          ...prev,
          onlineUsers: (prev?.onlineUsers || []).filter((u) => u.op_id !== user.op_id)
        }))
      })
      .listen('NewMessageEvent', (e) => {
        if (!profile?.op_id || !e?.message) return

        if (!isSender(e.message)) {
          setStoreChat((prev) => {
            if (e.message.parent_message_id) {
              return {
                ...prev,
                messages: prev.messages.map((m) => {
                  if (m.message_id === e.message.parent_message_id) {
                    return {
                      ...m,
                      replies: [...(m.replies || []), e.message]
                    }
                  }
                  return m
                })
              }
            }
            return {
              ...prev,
              messages: [...(prev?.messages || []), e.message]
            }
          })
        }
      })
      .listen('UpdateMessageEvent', (e) => {
        handleUpdateMessage(e.message, e.type)
      })

    window.Echo.private(`user-chat.${profile?.op_id}`)
      .listen('NewMessageEvent', (e) => {
        setStoreChat((prev) => {
          if (e.message.parent_message_id) {
            return {
              ...prev,
              messages: prev.messages.map((m) => {
                if (m.message_id === e.message.parent_message_id) {
                  return {
                    ...m,
                    replies: [...(m.replies || []), e.message]
                  }
                }
                return m
              })
            }
          }
          return {
            ...prev,
            messages: [...prev.messages, e.message]
          }
        })
      })
      .listen('UpdateMessageEvent', (e) => {
        handleUpdateMessage(e.message, e.type)
      })

    return () => {
      window.Echo.disconnect()
    }
  }, [profile?.op_id])

  return (
    <ChatProvider>
      <ChatLeftSidebar recentChatList={props.users} />
      <UserChat />
    </ChatProvider>
  )
}

const mapStateToProps = (state) => {
  const { users } = state.Chat
  return { users }
}

export default connect(mapStateToProps, {})(DashboardPage)
