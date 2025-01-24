import React from 'react'

const EMOJIS = [
  { code: '1f44d' },
  { code: '1f44e' },
  { code: '1f64f' },
  { code: '1f603' },
  { code: '1f621' },
  { code: '1f622' },
  { code: '2764-fe0f' }
]

const EmojiPicker = ({ style = {}, onEmojiClick }) => {
  return (
    <div className='emoji-picker' style={style}>
      {EMOJIS.map((emoji) => (
        <img
          className='emoji-picker-item'
          key={emoji.code}
          src={`/emojis/${emoji.code}.png`}
          alt={emoji.code}
          title={emoji.code}
          onClick={() => onEmojiClick?.(emoji)}
        />
      ))}
    </div>
  )
}

export default EmojiPicker
