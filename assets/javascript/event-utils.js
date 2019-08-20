import { IS_BASE64 } from "./regexp";

export const getExtname = url => url.replace(/.+\./, '').toLowerCase()

export const getFilename = url => url.replace(/(.*\/)*([^.]+).*/gi, '$2')

export const getFullFilename = url => {
  const ext = getExtname(url)
  const filename = getFilename(url)
  return ext && filename ? `${filename}.${ext}` : ''
}

export const Blob = window.Blob || window.MozBlob || window.WebKitBlob

export const base64ToBlob = (base64, contentType) => {
  const arr = base64.split(',')
  const mime = contentType || arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

export const blobToDataURL = (blob, callback) => {
  const file = new FileReader()
  file.onload = function (e) {
    callback(e.target.result)
  }
  file.readAsDataURL(blob)
}

export const downloadByIframe = href => {
  let iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = href
  document.body.appendChild(iframe)
  setTimeout(() => {
    document.body.removeChild(iframe)
  }, 1000)
}

export const downloadByBlob = (blob, filename = Date.now(), mode) => {
  const link = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  if ('download' in link) {
    downloadByLink(url, filename, true)
  } else if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename)
  }
}

export const downloadByXHR = (url, filename = Date.now()) => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  xhr.onload = e => {
    if (e.target.status === 200) {
      downloadByBlob(e.target.response, filename)
    }
  }
  xhr.send()
}

export const downloadByLink = (url, filename = Date.now(), mode) => {
  const link = document.createElement('a')
  if ('download' in link) {
    link.href = url
    console.log(image)
    image.src = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    if (mode) {
      setTimeout(() => {
        URL.revokeObjectURL(link.href)
      }, 1000)
    }
  } else if (document.createEvent) {
    const event = document.createEvent('MouseEvents')
    event.initMouseEvent(
      'click',
      true,
      true,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
    link.dispatchEvent(event)
  } else if (lnk.fireEvent) {
    link.fireEvent('onclick')
  } else if (!mode) {
    downloadByXHR(url, filename)
  }
}

export const downloadCanvas = canvas => {
  download(canvas.toDataURL('image/png;base64'))
}

export const download = (url, filename) => {
  if (IS_BASE64.test(url)) {
    downloadByBlob(base64ToBlob(url), filename)
  } else if (typeof url === 'string') {
    if (!filename) {
      const name = getFilename(url)
      filename = name ? name : Date.now()
    }
    downloadByXHR(url, filename)
  } else if (url instanceof Blob) {
    downloadByBlob(url, filename)
  }
}