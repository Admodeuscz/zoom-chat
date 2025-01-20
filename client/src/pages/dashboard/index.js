import React from 'react'
//Import Components
import { connect } from 'react-redux'
import ChatProvider from '../../providers/ChatProvider'
import ChatLeftSidebar from './ChatLeftSidebar'
import UserChat from './UserChat/index'

const DashboardPage = (props) => {
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
