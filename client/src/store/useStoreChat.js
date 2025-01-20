import { create } from 'zustand'

const useStoreChat = create((set) => ({
  toUser: { id: 'all', name: 'All' },
  members: [],
  messages: []
}))

export default useStoreChat

export function setStoreChat(x) {
  useStoreChat.setState(x)
}
