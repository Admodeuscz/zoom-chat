import http from '../utils/http'
import { encodeQueryData } from '../utils/utils'

export const URL_MESSAGES = '/messages'
export const URL_UPDATE_EMOJI = '/messages/:id/reactions'
export const URL_GET_ALL_MEMBER = '/operators'

const chatApi = {
  getMessages: async (params) => {
    return await http.get(`${URL_MESSAGES}?${encodeQueryData(params)}`)
  },
  getAllMemeber: async () => {
    return await http.get(URL_GET_ALL_MEMBER)
  },
  sendMessage: async (data) => {
    return await http.post(URL_MESSAGES, data, {
      headers: {
        'X-Socket-Id': window.Echo.socketId()
      }
    })
  },
  updateEmoji: async ({ messageId, emoji }) => {
    return await http.patch(`${URL_UPDATE_EMOJI.replace(':id', messageId)}`, emoji)
  }
}

export default chatApi
