import React, { useState } from 'react'
import { Button, Col, Form, Input, Row } from 'reactstrap'

function ChatInput({ onaddMessage }) {
  const [textMessage, settextMessage] = useState('')
  const [toUser, setToUser] = useState('all')

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
                    value={toUser}
                    onChange={(e) => setToUser(e.target.value)}
                    type='select'
                    className='form-select form-select-sm text-truncate'
                    style={{
                      width: '120px',
                      backgroundColor: '#0e71ed',
                      color: 'white'
                    }}
                  >
                    <option value='all'>All</option>
                    <option value='uid1' className='text-truncate'>
                      User 1
                    </option>
                    <option value='uid2' className='text-truncate'>
                      User 2
                    </option>
                    <option value='uid3' className='text-truncate'>
                      User 3
                    </option>
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
