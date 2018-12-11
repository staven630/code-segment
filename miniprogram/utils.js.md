### config.js
```
export const BASE_API = 'https://saas-api.mayitest.cn';
export const ACCESS_TOKEN = 'access_token';
```
### error.js
```
export const ERRORS = {};

export const MESSAGE_ERRORS = {};

export const AUTH_ERRORS = {};
```
### utils.js
```
import { BASE_API, ACCESS_TOKEN } from './config'
import fly from './request'

export const PrefixDate = time => {
  time = Number(time)
  return time < 10 ? '0' + time : time
}

export const FormatDate = (dateTime, format) => {
  format = typeof format === 'undefined' ? 'YYYY-MM-DD HH:mm' : format
  dateTime = isNaN(Number(dateTime)) ? dateTime : Number(dateTime)
  if (typeof dateTime === 'string') {
    dateTime = dateTime.replace(/\-/g, '/')
    dateTime = new Date(dateTime)
  } else if (typeof dateTime === 'number') {
    dateTime =
      dateTime.toString().length === 10
        ? new Date(1000 * dateTime)
        : new Date(dateTime)
  } else if (!(dateTime instanceof Date)) {
    dateTime = new Date()
  }
  const week = ['日', '一', '二', '三', '四', '五', '六']
  return format.replace(/YYYY|YY|MM|DD|HH|hh|mm|SS|ss|week/g, function(key) {
    switch (key) {
      case 'YYYY':
        return dateTime.getFullYear()
      case 'YY':
        return (dateTime.getFullYear() + '').slice(2)
      case 'MM':
        return PrefixDate(dateTime.getMonth() + 1)
      case 'DD':
        return PrefixDate(dateTime.getDate())
      case 'HH':
      case 'hh':
        return PrefixDate(dateTime.getHours())
      case 'mm':
        return PrefixDate(dateTime.getMinutes())
      case 'SS':
      case 'ss':
        return PrefixDate(dateTime.getSeconds())
      case 'week':
        return week[dateTime.getDay()]
    }
  })
}

//设置缓存 (单位为秒)
export const setStorage = (value, key = ACCESS_TOKEN) => {
  try {
    const params = {
      date: new Date().getTime(),
      value
    }
    wx.setStorageSync(key, JSON.stringify(params))
  } catch (error) {}
}

export const getStorage = (day = 1, key = ACCESS_TOKEN) => {
  try {
    let obj = wx.getStorageSync(key)
    if (!obj) return null
    obj = JSON.parse(obj)
    const date = new Date().getTime()
    if (date - obj.date > 86400000 * day) return null
    return obj.value
  } catch (error) {
    return null
  }
}

export const removeStorage = (key = ACCESS_TOKEN) => {
  try {
    wx.removeStorageSync(key)
  } catch (error) {}
}

export const WxToast = (title, icon = 'none') => {
  wx.showToast({
    title,
    icon,
    duration: 2000
  })
}

export const WxLoading = (title, icon = 'none') => {
  wx.showLoading({
    title,
    icon,
    mask: true,
    duration: 2000
  })
}

export const WxModel = (title, content) => {
  return promisify(wx.showModal, { title, content })
}

export const WxRedirectTo = type => {
  wx.redirectTo({
    url: `/pages/tips/tips?type=${type}`
  })
}

export const WxReLaunch = type => {
  wx.reLaunch({
    url: `/pages/tips/tips?type=${type}`
  })
}

export const promisify = (fn, options) => {
  return new Promise((resolve, reject) => {
    let data = {
      success: resolve,
      fail: reject
    }
    if (typeof options !== 'undefined') data = Object.assign(data, options)
    fn({
      ...data,
      success: resolve,
      fail: reject
    })
  })
}

export const WxRequest = options => promisify(wx.request, options)

export const WxLogin = (app, successFn = () => {}, failFn = () => {}) => {
  removeStorage()
  app.globalData.token = null
  WxLoading('授权中...')
  promisify(wx.login)
    .then(res => {
      fly
        .post('/yg-mini/login', {
          code: res.code
        })
        .then(res => {
          if (res.data.openid) {
            app.globalData.open_id = res.data.openid
          }
          if (res.data.token) {
            setStorage(app.globalData.token)
          }
          app.loginCallback && app.loginCallback(res)
          successFn(res)
        })
        .catch(err => {
          wx.hideLoading()
          failFn(err)
        })
    })
    .catch(err => {
      wx.hideLoading()
      failFn(err)
    })
}
```
### request.js
```
var Fly = require('./fly.js');
var fly = new Fly();
import { ERRORS, MESSAGE_ERRORS, AUTH_ERRORS } from './errors';
import { WxLogin, WxToast, WxModel, WxReLaunch, WxRedirectTo } from './utils';
import { BASE_API } from './config';

fly.config.headers['Accept'] = 'application/json';
fly.config.baseURL = BASE_API;

const HanderError = ({ code, message }) => {
  if (ERRORS[code]) return WxToast(ERRORS[code]);
  if (MESSAGE_ERRORS[code]) return WxToast(message);

  if (AUTH_ERRORS[code]) {
    return WxModel('提示', '登录状态失效，是否重新登陆')
      .then(res => {
        if (res.confirm) {
          WxLogin(getApp(), res => {
            wx.hideLoading();
            return wx.reLaunch({
              url: `/pages/index/index`
            });
          });
        } else if (res.cancel) {
          return WxReLaunch(3);
        }
      })
      .catch(err => {
        return WxReLaunch(3);
      })
  }
};

fly.interceptors.request.use(
  config => {
    const token = wx.getStorageSync('mayitools_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }
    return config;
  }
);

fly.interceptors.response.use(
  (res, promise) => {
    if (typeof(res.data) === 'string' && res.data != '') {
      res.data = JSON.parse(res.data);
    }
    return res.data;
  },
  (err, promise) => {
    if (err.response && err.response.data) {
      HanderError(err.response.data);
      return promise.reject(err.response.data);
    }
    return promise.reject(err);
  }
)

export default fly;
```
### pattern.js
```
export const IS_EMPTY = /^\s*$/;
export const IS_NUMBER = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
export const IS_PHONE = /^$|^1[3456789]\d{9}$/;
export const IS_IDCARD = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
export const IS_TELEPHONE = /(^(86)\-(0\d{2,3})\-(\d{7,8})\-(\d{1,4})$)|(^0(\d{2,3})\-(\d{7,8})$)|(^0(\d{2,3})\-(\d{7,8})\-(\d{1,4})$)|(^(86)\-(\d{3,4})\-(\d{7,8})$)/;
export const IS_EMAIL = /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/;
```
