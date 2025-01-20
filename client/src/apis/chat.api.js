import http from '../utils/http'
import { encodeQueryData } from '../utils/utils'

export const URL_GET_MESSAGES = '/messages'
export const URL_GET_ALL_MEMBER = '/operators'

const chatApi = {
  getMessages: async (params) => {
    return await http.get(`${URL_GET_MESSAGES}?${encodeQueryData(params)}`)
  },
  getAllMemeber: async () => {
    return await http.get(URL_GET_ALL_MEMBER)
  }
}

export default chatApi
