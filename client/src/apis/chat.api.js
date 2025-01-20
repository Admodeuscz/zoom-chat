import http from '../utils/http'
import { encodeQueryData } from '../utils/utils'

export const URL_GET_MESSAGES = '/messages'

const chatApi = {
  getMessages: async (params) => {
    return await http.get(`${URL_GET_MESSAGES}?${encodeQueryData(params)}`)
  }
}

export default chatApi
