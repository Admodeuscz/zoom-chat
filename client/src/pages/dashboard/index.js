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

    window.Echo.join('group-chat').listen('NewMessageEvent', (e) => {
      if (!profile?.op_id || !e?.message) return

      const isSender = e.message.sender_id === profile?.op_id
      if (!isSender) {
        setStoreChat((prev) => ({
          ...prev,
          messages: [...(prev?.messages || []), e.message]
        }))
      }
    })
    window.Echo.private(`user-chat.${profile?.op_id}`).listen('NewMessageEvent', (e) => {
      setStoreChat((prev) => ({
        ...prev,
        messages: [...prev.messages, e.message]
      }))
    })

    return () => {
      window.Echo.leaveChannel('group-chat')
    }
  }, [])
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
