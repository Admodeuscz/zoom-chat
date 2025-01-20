import http from '../utils/http'

const prefix = '/auth'
export const URL_LOGIN = `${prefix}/login`
export const URL_LOGOUT = `${prefix}/logout`
export const URL_REFRESH_TOKEN = `${prefix}/refresh`
export const URL_GET_ME = `${prefix}/me`

const authApi = {
  login: async (data) => {
    return await http.post(URL_LOGIN, data)
  },
  logout: async () => {
    return await http.post(URL_LOGOUT)
  },
  me: async () => {
    return await http.get(URL_GET_ME)
  }
}

export default authApi
