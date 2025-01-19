import { create } from 'zustand'

const useStoreUser = create((set) => ({
  profile: null,
  isLogged: false
}))

export default useStoreUser

export function setStoreUser(x) {
  console.log('🚀 ~ setStoreUser ~ x:', x)
  useStoreUser.setState(x)
}
