import Echo from 'laravel-echo'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import ChatProvider from '../../providers/ChatProvider'
import ChatLeftSidebar from './ChatLeftSidebar'
import UserChat from './UserChat/index'

import Pusher from 'pusher-js'
import { setStoreChat } from '../../store/useStoreChat'
const DashboardPage = (props) => {
  useEffect(() => {
    window.Pusher = Pusher

    window.Echo = new Echo({
      broadcaster: 'reverb',
      key: process.env.REACT_APP_PUSHER_APP_KEY,
      wsHost: process.env.REACT_APP_PUSHER_APP_HOST,
      wsPort: process.env.REACT_APP_PUSHER_APP_PORT,
      forceTLS: (process.env.REACT_APP_PUSHER_APP_SCHEME ?? 'https') === 'https',
      enabledTransports: ['ws', 'wss']
    })

    window.Echo.channel('group-chat').listen('GroupMessageSent', (e) => {
      setStoreChat((prev) => ({
        ...prev,
        messages: [...prev.messages, e.message]
      }))
    })
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
