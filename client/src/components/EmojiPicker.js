import React from 'react'

import thumbsUp from '../assets/images/emojis/1f44d.png'
import thumbsDown from '../assets/images/emojis/1f44e.png'
import smile from '../assets/images/emojis/1f603.png'
import angry from '../assets/images/emojis/1f621.png'
import cry from '../assets/images/emojis/1f622.png'
import pray from '../assets/images/emojis/1f64f.png'
import heart from '../assets/images/emojis/2764-fe0f.png'

const EMOJIS = [
  { code: '1f44d', src: thumbsUp },
  { code: '1f44e', src: thumbsDown },
  { code: '1f64f', src: pray },
  { code: '1f603', src: smile },
  { code: '1f621', src: angry },
  { code: '1f622', src: cry },
  { code: '2764-fe0f', src: heart }
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
