import { create } from 'zustand'

const useStoreUser = create((set) => ({
  toUser: 'all'
}))

export default useStoreUser

export function setStoreUser(x) {
  useStoreUser.setState(x)
}
