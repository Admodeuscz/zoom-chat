import axios from 'axios'
import { URL_LOGIN, URL_LOGOUT } from '../apis/auth.api'
import config from '../constants/config'
import { setStoreChat } from '../store/useStoreChat'
import { setStoreUser } from '../store/useStoreUser'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from './auth'

// Purchase: 1 - 3
// Me: 2 - 5
// Refresh Token cho purchase: 3 -  4
// Gọi lại Purchase: 4 - 6
// Refresh Token mới cho me: 5 - 6
// Gọi lại Me: 6

class Http {
  instance
  accessToken
  refreshToken
  refreshTokenRequest
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN) {
          const data = response.data

          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
          setProfileToLS(data.data.operator)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      (error) => {
        if (error.response.status === 401) {
          this.handleRefreshToken()
        }
        return Promise.reject(error)
      }
    )
  }
  async handleRefreshToken() {
    clearLS()
    setStoreUser(null)
    setStoreChat(null)
    this.accessToken = ''
    this.refreshToken = ''
    // try {
    //   const res = await this.instance.post(URL_REFRESH_TOKEN, {
    //     refresh_token: this.refreshToken
    //   })
    //   const { access_token } = res.data.data
    //   setAccessTokenToLS(access_token)
    //   this.accessToken = access_token
    //   return access_token
    // } catch (error) {
    //   clearLS()
    //   setStoreUser(null)
    //   setStoreChat(null)
    //   this.accessToken = ''
    //   this.refreshToken = ''

    //   Promise.reject(error)
    // }
  }
}
const http = new Http().instance
export default http
