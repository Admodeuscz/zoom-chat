import React from 'react'
import { UncontrolledTooltip } from 'reactstrap'
const reactionItemStyle = {
  backgroundColor: '#f0f2f5',
  padding: '2px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
}

const tooltipStyle = {
  maxWidth: '250px',
  backgroundColor: 'white',
  color: '#333',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  padding: '0'
}

const tooltipContentStyle = {
  maxHeight: '150px',
  overflowY: 'auto',
  padding: '8px 0',
  margin: 0,
  '::-webkit-scrollbar': {
    width: '6px'
  },
  '::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px'
  },
  '::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px'
  }
}

const senderItemStyle = {
  padding: '4px 12px',
  fontSize: '13px',
  whiteSpace: 'nowrap'
}
const ReactionItem = React.memo(({ reaction, messageId, index }) => {
  const tooltipId = `reaction-${messageId}-${index}`

  return (
    <React.Fragment>
      <span id={tooltipId} className='reaction-item' style={reactionItemStyle}>
        <span>{reaction?.icon}</span>
        {reaction?.senders?.length > 0 && <span style={{ fontWeight: '500' }}>{reaction?.senders?.length}</span>}
      </span>
      <UncontrolledTooltip target={tooltipId} placement='top' className='custom-tooltip' style={tooltipStyle}>
        <style>
          {`
            .custom-tooltip .tooltip-inner {
              background-color: white !important;
              color: #333 !important;
              border: 1px solid #ddd !important;
              border-radius: 8px !important;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
              padding: 0 !important;
            }
            .custom-tooltip .tooltip-arrow {
              display: none !important;
            }
          `}
        </style>
        <div style={tooltipContentStyle}>
          {reaction?.senders?.map((sender, idx) => (
            <div
              key={idx}
              style={{
                ...senderItemStyle,
                borderBottom: idx !== reaction.senders.length - 1 ? '1px solid #eee' : 'none'
              }}
            >
              {sender.op_name}
            </div>
          ))}
        </div>
      </UncontrolledTooltip>
    </React.Fragment>
  )
})

export default ReactionItem
