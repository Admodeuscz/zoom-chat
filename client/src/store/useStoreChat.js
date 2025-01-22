import { create } from 'zustand'

const useStoreChat = create((set) => ({
  toUser: null,
  members: [],
  messages: [],
  previousDay: null,
  active_user: null
}))

export default useStoreChat

export function setStoreChat(x) {
  useStoreChat.setState(x)
}
