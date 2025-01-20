import avatar1 from '../assets/images/users/avatar-1.jpg'
import avatar4 from '../assets/images/users/avatar-4.jpg'

export const MOCK_MESSAGES = [
  {
    id: 1,
    content: 'こんにちは！',
    time: '10:00',
    userType: 'sender',
    image: avatar1,
    isFileMessage: false,
    isImageMessage: false
  },
  {
    id: 2,
    message: 'お元気ですか？',
    time: '10:01',
    userType: 'receiver',
    image: avatar4,
    isFileMessage: false,
    isImageMessage: false
  },
  {
    id: 3,
    message: 'はい、元気です！',
    time: '10:02',
    userType: 'sender',
    image: avatar1,
    isFileMessage: false,
    isImageMessage: false
  }
]

export const MOCK_USER = {
  id: 1,
  name: '田中 花子',
  profilePicture: avatar4,
  isOnline: true,
  isGroup: false,
  messages: MOCK_MESSAGES
}
