import { create } from 'zustand'

const useStoreUser = create((set) => ({
  profile: {},
  isLogged: false
}))

export default useStoreUser

export function setStoreUser(x) {
  useStoreUser.setState(x)
}
