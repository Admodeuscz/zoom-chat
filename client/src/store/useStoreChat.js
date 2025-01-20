import { create } from 'zustand'

const useStoreChat = create((set) => ({
  toUser: { id: 'all', name: 'All' },
  members: [],
  setToUser: (id, name) => set({ toUser: { id, name } }),
  clearToUser: () => set({ toUser: { id: 'all', name: 'All' } })
}))

export default useStoreChat

export function setStoreChat(x) {
  useStoreChat.setState(x)
}
