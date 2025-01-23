import React from 'react'
import useSendMessage from '../../../hooks/api/useSendMessage'
import useStoreUser from '../../../store/useStoreUser'
import { genAvatar } from '../../../utils/utils'
import ChatInput from './ChatInput'

const ReplyBox = ({ messageId, marginLeft, expanded }) => {
  const profile = useStoreUser((state) => state?.profile)

  const { handleAddMessage } = useSendMessage()

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
      <div className='chat-avatar m-0'>
        <div className='avatar-xs'>
          <span className='avatar-title rounded-circle bg-primary-subtle text-primary'>
            {genAvatar(profile?.op_name)}
          </span>
        </div>
      </div>
      <ChatInput onaddMessage={handleAddMessage} isReply={true} parent_id={messageId} />
    </div>
  )
}

export default ReplyBox
