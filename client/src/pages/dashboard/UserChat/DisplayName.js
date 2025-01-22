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
  const isSender = message.sender_id === profile?.op_id
  const isReceiver = message.receiver_id === profile?.op_id
  const teamNameSender = `${Boolean(message.sender?.team?.team_name) ? `(${message.sender?.team?.team_name})` : ''}`
  const teamNameReceiver = `${Boolean(message.receiver?.team?.team_name) ? `(${message.receiver?.team?.team_name})` : ''}`
  const senderName = isSender ? 'You' : `${message.sender?.op_name} ${teamNameSender}` || 'Unknown'
  const receiverName = `${message.receiver?.op_name} ${teamNameReceiver}` || 'Unknown'

  const handleUserClick = (user) => {
    setStoreUser({ toUser: user })
  }

  const UserNameLink = ({ name, user }) => (
    <span style={userNameStyle} onClick={() => handleUserClick(user)} role='button' tabIndex={0}>
      {name}
    </span>
  )

  if (!message.receiver_id || !message.receiver) {
    return <span>{isSender ? 'You' : <UserNameLink name={senderName} user={message?.sender} />}</span>
  }

  return (
    <>
      <span>{isSender ? 'You' : <UserNameLink name={senderName} user={message?.sender} />}</span>
      <span> to </span>
      {isReceiver ? 'You' : <UserNameLink name={receiverName} user={message?.receiver} />}
      <span> (Direct Message)</span>
    </>
  )
})

export default DisplayName
