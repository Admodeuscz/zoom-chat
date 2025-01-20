import React from 'react'
//Import Components
import { connect } from 'react-redux'
import ChatLeftSidebar from './ChatLeftSidebar'
import UserChat from './UserChat/index'

const DashboardPage = (props) => {
  return (
    <React.Fragment>
      <ChatLeftSidebar recentChatList={props.users} />

      <UserChat />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  const { users } = state.Chat
  return { users }
}

export default connect(mapStateToProps, {})(DashboardPage)
