import React, { useState } from 'react'
import { Button, Input } from 'reactstrap'
import useStoreUser from '../../../store/useStoreUser'
import { genAvatar } from '../../../utils/utils'

const ReplyBox = ({ messageId, marginLeft, expanded }) => {
  const profile = useStoreUser((state) => state?.profile)

  const [textMessage, setTextMessage] = useState('')

  const handleChange = (e) => {
    setTextMessage(e.target.value)
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      console.log(textMessage)
    }
  }

  const handleSubmit = () => {
    console.log(textMessage)
  }

  return (
    <div
      className='mt-2 d-flex align-items-center'
      style={{
        marginLeft: marginLeft,
        height: expanded ? 'auto' : '0',
        opacity: expanded ? 1 : 0,
        overflow: 'hidden'
      }}
    >
      <div className='chat-avatar'>
        <div className='avatar-xs'>
          <span className='avatar-title rounded-circle bg-primary-subtle text-primary'>
            {genAvatar(profile?.op_name)}
          </span>
        </div>
      </div>
      <Input
        type='text'
        value={textMessage}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        className='form-control form-control-lg bg-light border-light me-2'
        placeholder='メッセージを入力...'
      />
      <Button type='submit' color='primary' className='btn-sm chat-send waves-light' onClick={handleSubmit}>
        <i className='ri-send-plane-fill fs-4'></i>
      </Button>
    </div>
  )
}

export default ReplyBox
