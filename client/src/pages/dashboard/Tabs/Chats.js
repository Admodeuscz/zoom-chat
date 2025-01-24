import React, { useState } from 'react'
import { Link } from 'react-router-dom'

//simplebar
import SimpleBar from 'simplebar-react'

//actions

//components
import { Input, InputGroup } from 'reactstrap'
import useStoreChat from '../../../store/useStoreChat'
import { genAvatar, getOperatorColor } from '../../../utils/utils'
import OnlineUsers from './OnlineUsers'

const Chats = () => {
  const members = useStoreChat((state) => state?.members)
  const [searchChat, setSearchChat] = useState('')

  const handleSearch = (e) => {
    setSearchChat(e.target.value)
  }

  const filteredMembers = members?.filter(
    (member) =>
      member.op_name.toLowerCase().includes(searchChat.toLowerCase()) ||
      member.team.team_name.toLowerCase().includes(searchChat.toLowerCase())
  )

  return (
    <React.Fragment>
      <div>
        <div className='px-4 pt-4'>
          <h4 className='mb-4'>チャット</h4>
          <div className='search-box chat-search-box'>
            <InputGroup className='mb-3 rounded-3'>
              <span className='input-group-text text-muted bg-light pe-1 ps-3' id='basic-addon1'>
                <i className='ri-search-line search-icon font-size-18'></i>
              </span>
              <Input
                type='text'
                value={searchChat}
                onChange={handleSearch}
                className='form-control bg-light'
                placeholder='ユーザーを検索'
              />
            </InputGroup>
          </div>
        </div>

        <OnlineUsers />

        {/* Start chat-message-list  */}
        <div>
          <h5 className='mb-3 px-3 font-size-16'>ユーザー一覧</h5>
          <SimpleBar className='chat-message-list'>
            <ul className='list-unstyled chat-list chat-user-list px-2' id='chat-list'>
              {filteredMembers?.map((member, key) => (
                <li key={key}>
                  <Link
                    style={{
                      cursor: 'default'
                    }}
                  >
                    <div className='d-flex align-items-center'>
                      <div className={'chat-user-img ' + member.status + ' align-self-center ms-0'}>
                        <div className='avatar-xs'>
                          <span
                            className='avatar-title rounded-circle'
                            style={{ background: getOperatorColor(member) }}
                          >
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
