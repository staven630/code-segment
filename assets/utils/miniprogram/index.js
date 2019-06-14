import { ACCESS_TOKEN } from './config'
import http from './http'

// 获取当前页面
export function getCurrPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

// 获取当前页路径
export function getCurrRoute() {
  return getCurrPage().route
}

// 获取当前页参数
export function getCurrParams() {
  return getCurrRoute().options
}

// 获取当前页带参数路径
export function getCurrUrl() {
  const page = getCurrPage()
  let url = page.route
  let query = []
  Object.keys(page.options).forEach(key => {
    query.push(`${key}=${page.options[key]}`)
  })
  let urlQuery = query.join('&')
  if (urlQuery) {
    url = `${url}?${urlQuery}`
  }
  return url
}

export function setStorage(value, key = ACCESS_TOKEN || 'access_token') {
  try {
    const params = {
      date: new Date().getTime(),
      value
    }
    wx.setStorageSync(key, JSON.stringify(params))
  } catch (error) {}
}

/**
 *
 * @param {String} key
 * @param {Number} day 有效天数
 */
export function getStorage(key = ACCESS_TOKEN || 'access_token', day = 0.495) {
  try {
    let obj = wx.getStorageSync(key)
    if (!obj) return null
    obj = JSON.parse(obj)
    const date = new Date().getTime()
    if (date - obj.date > 86400000 * day) {
      removeStorage(key)
      return null
    }
    return obj.value
  } catch (error) {
    return null
  }
}

export function removeStorage(key = ACCESS_TOKEN || 'access_token') {
  try {
    wx.removeStorageSync(key)
  } catch (error) {}
}

export function promisify(fn, options = {}) {
  if (typeof fn === 'function') {
    return new Promise((resolve, reject) => {
      fn({
        success: resolve,
        fail: reject,
        ...options
      })
    })
  }
  throw new Error('fn is not a function')
}

export function navigateTo(url, options = {}) {
  if (!url) return
  return promisify(wx.navigateTo, {
    url,
    ...options
  })
}

export function redirect(url, options = {}) {
  if (!url) return
  return promisify(wx.redirectTo, {
    url,
    ...options
  })
}

export function reLaunch(url, options = {}) {
  if (!url) return
  return promisify(wx.reLaunch, {
    url,
    ...options
  })
}

export function showToast(title, icon = 'none', options = {}) {
  return promisify(wx.showToast, {
    title,
    icon,
    ...options
  })
}

export function hideToast(options = {}) {
  return promisify(wx.hideToast, options)
}

export function showLoading(title = '加载中……', icon = 'none', options = {}) {
  return promisify(wx.showLoading, {
    title,
    icon,
    mask: true,
    ...options
  })
}

export function hideLoading(options = {}) {
  return promisify(wx.hideLoading, options)
}

export function showModal(title, content, options = {}) {
  return promisify(wx.showModal, {
    title,
    content,
    ...options
  })
}

export function request(options = {}) {
  return promisify(wx.request, options)
}
export function logout(ctx = getApp()) {
  ctx.globalData.token = null
}

export function login(
  ctx = getApp(),
  url,
  key,
  successFn = () => {},
  failFn = () => {}
) {
  logout(ctx)
  promisify(wx.login)
    .then(res => {
      http
        .post(url, {
          [key]: res.code
        })
        .then(res => {
          successFn(res)
          hideLoading()
        })
        .catch(err => {
          hideLoading().then(res => {
            failFn(err)
          })
        })
    })
    .catch(err => {
      hideLoading().then(res => {
        failFn(err)
      })
    })
}

export function openFile(url, fileType = 'pdf') {
  if (!url) return
  promisify(wx.downloadFile, {
    url: url.startsWidth('http') ? url : `${BASE_API}url`,
    header: {
      Authorization: `Bearer ${getStorage()}`
    }
  })
    .then(res => {
      const filePath = res.tempFilePath
      wx.openDocument({
        filePath,
        fileType
      })
    })
    .catch(err => {})
}

export function uploadFile(
  url,
  filePath,
  name = 'file',
  successFn = () => {},
  formData = {}
) {
  showLoading('上传中……')
  promisify(wx.uploadFile, {
    url: `${BASE_API}${url}`,
    filePath,
    name,
    formData,
    header: {
      accept: 'application/json',
      Authorization: `Bearer ${getStorage()}`
    }
  })
    .then(res => {
      successFn(res)
    })
    .catch(err => {
      hideLoading()
    })
}

export function checkVersion() {
  const updateManager = wx.getUpdateManager()

  updateManager.onCheckForUpdate(({ hasUpdate }) => {
    if (!hasUpdate) return
    updateManager.onUpdateReady(() => {
      showModel('更新提示', '新版本已经准备好，是否重启应用？').then(res => {
        if (res.confirm) {
          updateManager.applyUpdate()
        } else {
          showModel('提示', '升级到最新版本体验更好哦')
        }
      })
    })

    updateManager.onUpdateFailed(() => {
      showModel(
        '更新失败',
        '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开小程序'
      ).then(res => {})
    })
  })
}

export function reverseGeocoder(
  latitude,
  longitude,
  success = () => {},
  fail = () => {}
) {
  return wx.request({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    data: {
      location: `${latitude},${longitude}`,
      key: QQ_MAP_KEY,
      get_poi: 0
    },
    success,
    fail
  })
}

// 获取定位信息
export function getLocation(successFn = () => {}, failFn = () => {}) {
  wx.getLocation({
    type: 'gcj02',
    success: res => {
      reverseGeocoder(res.latitude, res.longitude, successFn, failFn)
    },
    fail: err => {}
  })
}
