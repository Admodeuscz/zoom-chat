import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import chatApi from '../../../apis/chat.api'
import { setStoreChat } from '../../../store/useStoreChat'
import useStoreUser from '../../../store/useStoreUser'
import { Button, Col, Input, Row } from 'reactstrap'
import { genAvatar } from '../../../utils/utils'

const ReplyBox = ({ messageId, marginLeft }) => {
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

    return <div className='mt-2 d-flex align-items-center' style={{ marginLeft: marginLeft }}>
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
            className='form-control form-control-lg bg-light border-light'
            placeholder='メッセージを入力...'
        />
        <Button type='submit' color='primary' className='btn-sm chat-send waves-light' onClick={handleSubmit}>
            <i className='ri-send-plane-fill fs-4'></i>
        </Button>
    </div>
}

export default ReplyBox
