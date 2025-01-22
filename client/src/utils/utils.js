import axios from 'axios'
import HttpStatusCode from '../constants/httpStatusCode'

export function isAxiosError(error) {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError(error) {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isAxiosUnauthorizedError(error) {
  return isAxiosError(error) && error?.status === HttpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError(error) {
  return isAxiosUnauthorizedError(error) && error.response?.data?.data?.name === 'EXPIRED_TOKEN'
}

export function encodeQueryData(data) {
  let ret = []
  for (let d in data) {
    if (data[d] !== null && data[d] !== undefined) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
    }
  }
  return ret.join('&')
}

export function genAvatar(name) {
  const nameParts = name.split(' ')
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0)
  }
  return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
}

export const handleScrollBottom = (ref) => {
  if (ref.current?.el) {
    ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight
  }
}
