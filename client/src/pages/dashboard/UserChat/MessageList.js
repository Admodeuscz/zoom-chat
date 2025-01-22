import React from 'react'

import moment from 'moment'
import { useTranslation } from 'react-i18next'
import Loading from '../../../components/Loading'
import MessageItem from './MessageItem'

const DateDivider = React.memo(({ date }) => {
  const { t } = useTranslation()
  const formatMessageDate = (dateString) => {
    const messageDate = moment(dateString)
    const today = moment()
    const yesterday = moment().subtract(1, 'days')

    if (messageDate.isSame(today, 'day')) {
      return t('Today')
    }

    if (messageDate.isSame(yesterday, 'day')) {
      return t('Yesterday')
    }

    return messageDate.format('DD/MM/YYYY')
  }

  return (
    <div className='chat-day-title'>
      <span className='title'>{formatMessageDate(date)}</span>
    </div>
  )
})

const MessageList = ({ isLoading, currentUser, messages }) => {
  const { t } = useTranslation()

  const messageArray = Array.isArray(messages) ? messages : []
  if (!messageArray.length) return null

  const renderMessages = () => {
    let currentDate = null
    const messageElements = []

    messageArray.forEach((message, index) => {
      const messageDate = new Date(message.created_at).toDateString()

      if (messageDate !== currentDate) {
        currentDate = messageDate
        messageElements.push(
          <li key={`date-${message.created_at}`}>
            <DateDivider date={message.created_at} />
          </li>
        )
      }

      messageElements.push(
        <li key={message.message_id}>
          <MessageItem message={message} currentUser={currentUser} t={t} />
        </li>
      )
    })

    return messageElements
  }

  return (
    <>
      <ul className='list-unstyled mb-0'>
        {isLoading && <Loading />}
        {renderMessages()}
      </ul>
    </>
  )
}

export default React.memo(MessageList)
