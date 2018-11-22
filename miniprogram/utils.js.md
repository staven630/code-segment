config.js
```
export const BASE_API = '';
export const ACCESS_TOKEN = '';
```

小程序utils.js
```
import { BASE_API, ACCESS_TOKEN } from './config'

export const PrefixDate = (time) => {
  return +time < 10 ? '0' + time : time;
};

export const FormatDate = (dateTime, format = 'YYYY-MM-DD HH:mm') => {
  dateTime = isNaN(Number(dateTime)) ? dateTime : Number(dateTime);

  if (typeof dateTime === 'string') {
    dateTime = dateTime.replace(/\-/g, '/');
    dateTime = new Date(dateTime);
  } else if (typeof dateTime === 'number') {
    dateTime = new Date(dateTime);
  } else if (!(dateTime instanceof Date)) {
    dateTime = new Date();
  }

  const week = ['日', '一', '二', '三', '四', '五', '六'];
  return format.replace(/YYYY|YY|MM|DD|HH|hh|mm|SS|ss|week/g, function(key) {
    switch (key) {
      case 'YYYY':
        return dateTime.getFullYear();
      case 'YY':
        return(dateTime.getFullYear() + '').slice(2);
      case 'MM':
        return PrefixDate(dateTime.getMonth() + 1);
      case 'DD':
        return PrefixDate(dateTime.getDate());
      case 'HH':
      case 'hh':
        return PrefixDate(dateTime.getHours());
      case 'mm':
        return PrefixDate(dateTime.getMinutes());
      case 'SS':
      case 'ss':
        return PrefixDate(dateTime.getSeconds());
      case 'week':
        return week[dateTime.getDay()];
    }
  });
};

export const Toast = (title, icon = 'none') => {
  wx.showToast({
    title,
    icon,
    duration: 2000
  });
}

export const Loading = (title, icon = 'none') => {
  wx.showLoading({
    title,
    icon,
    mask: true,
    duration: 2000
  });
}

//设置缓存 (单位为秒)
export const setStorage = (value, key = ACCESS_TOKEN) => {
  const params = {
    date: new Date().getTime(),
    value
  };
  wx.setStorageSync(key, JSON.stringify(params));
}


export const getStorage = (day = 0.5, key = ACCESS_TOKEN) => {
  let obj = wx.getStorageSync(key);
  if (!obj) return null;
  obj = JSON.parse(obj);
  const date = new Date().getTime();
  if (date - obj.date > 86400000 * day) return null;
  return obj.value;
}

export const removeStorage = (key = ACCESS_TOKEN) => {
  wx.removeStorageSync(key);
}


export const redirectTo = (type) => {
  wx.redirectTo({
    url: `/pages/errors/errors?type=${type}`
  });
};

export const reLaunch = (type) => {
  wx.wx.reLaunch({
    url: `/pages/errors/errors?type=${type}`
  });
};

const promisify = original => {
  return (...opt) => {
    return new Promise((resolve, reject) => {
      opt = Object.assign({
        success: resolve,
        fail: reject
      }, opt)
      original(...opt)
    })
  }
}

export const request = () => {
  return promisify(wx.request);
}


export const wxLogin = (app, api, successFn = () => { }, failFn = () => { }) => {
  removeStorage();
  app.globalData.token = null;
  promisify(wx.login)
    .then(res => {
      request({
        url: BASE_API + api,
        data: { code: res.code },
        header: {
          'content-type': 'application/json'
        },
      })
        .then(res => {
          // 获取token
          const token = res.data.data.session_key;
          // 修改globalData
          app.globalData.token = token;
          // 设置缓存
          setStorage(token);
          successFn(res);
        }).catch(err => {
          reLaunch(1);
        });
    }).catch(err => {
      reLaunch(2)
    });
};

```