import { create } from 'zustand'

const useStoreChat = create((set) => ({
  toUser: null,
  members: [],
  messages: [],
  previousDay: null,
  onlineUsers: [],
  active_user: null,
  isShowMembers: false,
  isShowChat: true,
}))

export default useStoreChat

export function setStoreChat(x) {
  useStoreChat.setState(x)
}
