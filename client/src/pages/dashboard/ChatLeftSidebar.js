import React from 'react'
import { connect } from 'react-redux'

import { TabContent, TabPane } from 'reactstrap'

import Profile from './Tabs/Profile'

function ChatLeftSidebar(props) {
  const activeTab = props.activeTab

  return (
    <React.Fragment>
      <div className='chat-leftsidebar me-lg-1'>
        <TabContent activeTab={activeTab}>
          <TabPane tabId='profile' id='pills-user'>
            <Profile />
          </TabPane>
        </TabContent>
      </div>
    </React.Fragment>
  )
}

const mapStatetoProps = (state) => {
  return {
    ...state.Layout
  }
}

export default connect(mapStatetoProps, null)(ChatLeftSidebar)
