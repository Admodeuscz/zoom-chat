import React from 'react'
import { Link } from 'react-router-dom'

//simplebar
import SimpleBar from 'simplebar-react'

//actions

//components
import useStoreChat from '../../../store/useStoreChat'
import { genAvatar } from '../../../utils/utils'
import OnlineUsers from './OnlineUsers'

const Chats = () => {
  const members = useStoreChat((state) => state.members)

  return (
    <React.Fragment>
      <div>
        <div className='px-4 pt-4'>
          <h4 className='mb-4'>Chats</h4>
          {/* <div className='search-box chat-search-box'>
            <InputGroup className='mb-3 rounded-3'>
              <span className='input-group-text text-muted bg-light pe-1 ps-3' id='basic-addon1'>
                <i className='ri-search-line search-icon font-size-18'></i>
              </span>
              <Input
                type='text'
                value={this.state.searchChat}
                onChange={(e) => this.handleChange(e)}
                className='form-control bg-light'
                placeholder='ユーザーを検索'
              />
            </InputGroup>
          </div> */}
        </div>

        <OnlineUsers />

        {/* Start chat-message-list  */}
        <div>
          <h5 className='mb-3 px-3 font-size-16'>ユーザー一覧</h5>
          <SimpleBar className='chat-message-list'>
            <ul className='list-unstyled chat-list chat-user-list px-2' id='chat-list'>
              {members.map((member, key) => (
                <li key={key}>
                  <Link>
                    <div className='d-flex align-items-center'>
                      <div className={'chat-user-img ' + member.status + ' align-self-center ms-0'}>
                        <div className='avatar-xs'>
                          <span className='avatar-title rounded-circle bg-primary-subtle text-primary'>
                            {genAvatar(member.op_name)}
                          </span>
                        </div>
                        {member.status && <span className='user-status'></span>}
                      </div>

                      <div className='flex-grow-1 overflow-hidden'>
                        <h5 className='text-truncate font-size-15 mb-0 ms-3'>
                          {member.op_name} ({member.team.team_name})
                        </h5>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </SimpleBar>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Chats
