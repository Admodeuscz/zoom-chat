import React, { useEffect, useRef } from 'react'
import EmojiPicker from '../../../components/EmojiPicker'
import useStoreUser from '../../../store/useStoreUser'
import { handleEmojiClick } from '../../../utils/emojiHandler'

const EmojiPickerBox = ({ message, isShow, setIsShow, marginLeft }) => {
  const profile = useStoreUser((state) => state?.profile)
  const ref = useRef(null)

  const onEmojiSelect = (emoji) => {
    handleEmojiClick(message, emoji, profile, setIsShow)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsShow(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setIsShow])

  return (
    isShow && (
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: marginLeft,
          zIndex: 1000
        }}
        ref={ref}
      >
        <EmojiPicker onEmojiClick={onEmojiSelect} />
      </div>
    )
  )
}

export default EmojiPickerBox
