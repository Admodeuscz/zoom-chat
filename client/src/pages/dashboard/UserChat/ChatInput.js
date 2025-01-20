import React, { useState } from 'react'
import { Button, Col, Form, Input, Row } from 'reactstrap'
import useStoreChat from '../../../store/useStoreChat'
import useStoreUser, { setStoreUser } from '../../../store/useStoreUser'

const ChatInput = ({ onaddMessage }) => {
  const [textMessage, settextMessage] = useState('')
  const { toUser } = useStoreUser()
  const { members } = useStoreChat()
  const handleChange = (e) => {
    settextMessage(e.target.value)
  }

  const handleSubmit = (e, { textMessage, toUser }) => {
    e.preventDefault()
    if (textMessage !== '') {
      onaddMessage(textMessage, toUser)
      settextMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e, { textMessage, toUser })
    }
  }

  const handleChangeToUser = (e) => {
    const selectedMember = members.find((m) => m.op_id === e.target.value)
    setStoreUser({
      toUser: selectedMember
    })
  }

  return (
    <React.Fragment>
      <div className='chat-input-section p-2 p-lg-3 border-top mb-0'>
        <Form onSubmit={(e) => handleSubmit(e, { textMessage, toUser })}>
          <Row className='g-0'>
            <Col>
              <div className='position-relative'>
                <div className='d-flex align-items-center mb-2'>
                  <span className='me-2'>To:</span>
                  <Input
                    value={toUser?.op_id || 'all'}
                    onChange={handleChangeToUser}
                    type='select'
                    className='form-select form-select-sm text-truncate'
                    style={{
                      width: '120px'
                    }}
                  >
                    <option value='all'>All</option>
                    {members.map((member, key) => (
                      <option value={member.op_id} key={key}>
                        {member.op_name}
                      </option>
                    ))}
                  </Input>
                </div>
                <Row>
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
                  <Col xs='auto'>
                    <Button
                      type='submit'
                      color='primary'
                      className='font-size-12 btn-sm chat-send waves-effect waves-light'
                    >
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
