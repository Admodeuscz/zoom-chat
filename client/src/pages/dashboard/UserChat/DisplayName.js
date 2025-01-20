import React, { memo } from 'react'
import { setStoreUser } from '../../../store/useStoreUser'

const userNameStyle = {
  color: '#6366f1',
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline'
  }
}

const DisplayName = memo(({ message, profile }) => {
  const isSender = message.sender_id === profile.op_id
  const senderName = isSender ? 'You' : message.sender?.op_name || 'Unknown'
  const receiverName = message.receiver?.op_name || 'Unknown'

  const handleUserClick = (userId) => {
    setStoreUser({ toUser: userId })
  }

  const UserNameLink = ({ name, userId }) => (
    <span style={userNameStyle} onClick={() => handleUserClick(userId)} role='button' tabIndex={0}>
      {name}
    </span>
  )

  if (!message.receiver_id || !message.receiver) {
    return <span>{isSender ? 'You' : <UserNameLink name={senderName} userId={message.sender_id} />}</span>
  }

  return (
    <>
      <span>{isSender ? 'You' : <UserNameLink name={senderName} userId={message.sender_id} />}</span>
      <span> to </span>
      <UserNameLink name={receiverName} userId={message.receiver_id} />
      <span> (Direct Message)</span>
    </>
  )
})

export default DisplayName
