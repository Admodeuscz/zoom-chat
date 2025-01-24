import React, { useState } from 'react'
import { Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, Input, Row } from 'reactstrap'
import useStoreChat from '../../../store/useStoreChat'
import useStoreUser, { setStoreUser } from '../../../store/useStoreUser'

const ChatInput = ({ onaddMessage, isReply = false, parent_id = null }) => {
  const [textMessage, settextMessage] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const toUser = useStoreUser((state) => state?.toUser)
  const handleChange = (e) => {
    settextMessage(e.target.value)
  }

  const handleSubmit = (e, { textMessage, toUser }) => {
    e.preventDefault()
    if (textMessage !== '') {
      onaddMessage(textMessage, toUser, parent_id)
      settextMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e, { textMessage, toUser })
    }
  }

  const toggle = () => {
    if (!onlineUsers?.length && !dropdownOpen) return
    setDropdownOpen((prevState) => !prevState)
  }

  const handleChangeToUser = (selectedMember) => {
    setStoreUser({
      toUser: selectedMember || null
    })
  }
  const onlineUsers = useStoreChat((state) => state?.onlineUsers) ?? []

  return (
    <React.Fragment>
      <div className={`p-2 ${!isReply ? 'p-lg-3 chat-input-section' : ''} mb-0 ${!isReply ? 'border-top' : ''}`}>
        <Form onSubmit={(e) => handleSubmit(e, { textMessage, toUser })}>
          <Row className='g-0'>
            <Col>
              <div className='position-relative'>
                {!isReply && (
                  <div className='d-flex align-items-center mb-2'>
                    <span className='me-2'>宛先:</span>
                    <Dropdown isOpen={dropdownOpen} toggle={toggle} size='sm' direction='up'>
                      <DropdownToggle
                        className='text-truncate'
                        style={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          backgroundColor: '#3b82f6',
                          borderRadius: '12px',
                          padding: '2px 15px',
                          fontSize: '12px'
                        }}
                      >
                        {toUser?.op_name || '全員'}
                      </DropdownToggle>
                      <DropdownMenu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {onlineUsers?.length > 0 && (
                          <DropdownItem onClick={() => handleChangeToUser(null)}>全員</DropdownItem>
                        )}
                        {onlineUsers?.map((onlineUser) => (
                          <DropdownItem key={onlineUser.op_id} onClick={() => handleChangeToUser(onlineUser)}>
                            {onlineUser.op_name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                )}
                <Row className='me-0'>
                  <Col>
                    <Input
                      type='text'
                      value={textMessage}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      className='form-control form-control-lg bg-light border-light'
                      placeholder='メッセージを入力...'
                    />
                  </Col>
                  <Col xs='auto' className='p-0'>
                    <Button type='submit' color='primary' className='btn-sm chat-send waves-effect waves-light'>
                      <i className='ri-send-plane-fill fs-4'></i>
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </React.Fragment>
  )
}

export default ChatInput
