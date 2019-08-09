* index.html
```html
<section class="controls">
  <button id="sync-message">Send IPC message to main</button>
  <button id="async-message">Use remote</button>
</section>
</body>
<script>
  require('./renderer.js')
</script>
```

* main.js
```javascript
const { app, BrowserWindow, ipcMain } = require('electron')
let win = null

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 加载本地HTML文件
  win.loadURL(`file://${__dirname}/index.html`)
  win.webContents.openDevTools({ mode: 'bottom' })
  win.once('ready-to-show', () => {
    win.show()
  })
  win.on('closed', () => {
    win = null
  })

  ipcMain.on('sync-message', (event, args) => {
    console.log('ipcMain 接收sync事件: ', args)
    event.returnValue = 'staven'
  })

  ipcMain.on('async-message', (event, args) => {
    console.log('ipcMain 接收async事件: ', args)
    event.sender.send('async-reply', '主进程 => 渲染进程: 响应async事件')
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!win) {
    createWindow()
  }
})
```

* renderer.js
```javascript
const { ipcRenderer } = require('electron')

document.querySelector('#sync-message').addEventListener('click', () => {
  const result = ipcRenderer.sendSync('sync-message', '渲染进程 => 主进程:发送sync事件')
  console.log(result);
})

document.querySelector('#async-message').addEventListener('click', () => {
  ipcRenderer.send('async-message', '渲染进程 => 主进程:发送async事件')
})

ipcRenderer.on('async-reply', (event, args) => {
  console.log('ipcRenderer 接收async事件: ')
})
```