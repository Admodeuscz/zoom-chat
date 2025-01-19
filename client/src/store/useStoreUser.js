import { create } from 'zustand'

const useStoreUser = create((set) => ({
  profile: null,
  isLogged: false
}))

export default useStoreUser

export function setStoreUser(x) {
  useStoreUser.setState(x)
}
