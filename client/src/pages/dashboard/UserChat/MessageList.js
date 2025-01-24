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
      return t('今日')
    }

    if (messageDate.isSame(yesterday, 'day')) {
      return t('昨日')
    }

    return messageDate.format('DD/MM/YYYY')
  }

  return (
    <div className='chat-day-title'>
      <span className='title'>{formatMessageDate(date)}</span>
    </div>
  )
})

const MessageList = ({ isLoading, currentUser, messages = [] }) => {
  const { t } = useTranslation()

  return (
    <ul className='list-unstyled mb-0'>
      {isLoading && <Loading />}
      {messages?.map((message, index) => {
        return message?.type === 'date' ? (
          <li key={message.content}>
            <DateDivider date={message.content} />
          </li>
        ) : (
          <li key={`${message.message_id}-${index}`}>
            <MessageItem message={message} currentUser={currentUser} t={t} messages={messages} index={index} />
          </li>
        )
      })}
    </ul>
  )
}

export default React.memo(MessageList)
