import Http from './fly'
import { BASE_API } from './config'
import {
  getCurrentPageUrl,
  getStorage,
  showModal,
  hideLoading,
  reLaunch,
  login,
  showToast
} from './index'

const ERRORS = {
  10000: '未知错误'
}

const AUTH_ERRORS = {
  401: '身份认证错误，请重新登录'
}

var http = new Http()

http.config.headers['Accept'] = 'application/json'
http.config.baseURL = BASE_API

const HanderError = ({ code, message }) => {
  if (ERRORS[code]) return showToast(ERRORS[code])

  if (AUTH_ERRORS[code]) {
    const currentPage = getCurrentPageUrl()
    return showModal('提示', '登录状态失效，是否重新登陆')
      .then(res => {
        if (res.confirm) {
          // 重新登录逻辑
          login(getApp(), res => {
            hideLoading().then(e => {
              reLaunch(currentPage)
            })
          })
        } else if (res.cancel) {
          return reLaunch(`/pages/error/index?code=${code}`)
        }
      })
      .catch(err => {
        return reLaunch(`/pages/error/index?code=${code}`)
      })
  }
  showToast(message)
}

http.interceptors.request.use(config => {
  const token = getStorage()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (res, promise) => {
    if (typeof res.data === 'string' && res.data != '') {
      res.data = JSON.parse(res.data)
    }
    return res.data
  },
  (err, promise) => {
    if (err.response && err.response.data) {
      HanderError(err.response.data)
      return promise.reject(err.response.data)
    }
    return promise.reject(err)
  }
)

export default http
