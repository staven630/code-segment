
```javascript
const { app, BrowserWindow, Menu } = require('electron')

let win = null

function createMenu() {
  const topLevelItems = [
    {
      label: 'Code',
      submenu: [
        {
          label: '关于 BookMarker',
          click() { }
        },
        { label: '检查更新' },
        { type: 'separator' },
        {
          label: '首选项',
          submenu: [
            { label: '设置', click() { } },
            { label: '联机服务设置' },
            { label: '扩展', accelerator: 'Shift+CmdOrCtrl+X' },
            { type: 'separator' },
            { label: '键盘快捷方式', click() { } },
            { label: '按键映射', click() { } },
            { label: '用户代码片段' },
            { label: '颜色主题' },
            { label: '文件图标主题' }
          ]
        },
        { type: 'separator' },
        {
          label: '服务',
          submenu: [
            { label: '没有服务可用' },
            { label: '服务偏好设置', click() { } }
          ]
        },
        { type: 'separator' },
        { label: '隐藏Bookmarker', accelerator: 'CmdOrCtrl+H' },
        { label: '隐藏其他', accelerator: 'Alt+CmdOrCtrl+X' },
        { label: '显示全部' },
        { type: 'separator' },
        {
          label: '退出 Bookmarker',
          accelerator: 'CmdOrCtrl+Q',
          click() {
            app.quit()
          }
        }
      ]
    },
    {
      label: '文件',
      submenu: [
        { label: '新建文件', accelerator: 'CmdOrCtrl+N' },
        { label: '新建窗口', accelerator: 'Shift+CmdOrCtrl+N' },
        { type: 'separator' },
        { label: '打开文件', accelerator: 'CmdOrCtrl+O' },
        { label: '打开文件夹', accelerator: 'Shift+CmdOrCtrl+O' },
        { label: '打开工作区…' },
        { label: '打开最近的文件' },
        { type: 'separator' },
        { label: '将文件夹添加到工作区' },
        { label: '将工作区另存为…' },
        { type: 'separator' },
        { label: '保存', accelerator: 'CmdOrCtrl+S' },
        { label: '另存为', accelerator: 'Shift+CmdOrCtrl+S' },
        { label: '全部保存', accelerator: 'Alt+CmdOrCtrl+K S' },
        { type: 'separator' },
        { label: '自动保存' },
        { label: '首选项' },
        { type: 'separator' },
        { label: '还原文件' },
        { label: '关闭编辑器', accelerator: 'CmdOrCtrl+F4' },
        { label: '关闭文件夹', accelerator: 'CmdOrCtrl+K F' },
        { label: '关闭窗口', accelerator: 'CmdOrCtrl+W' },
        { type: 'separator' },
        { label: '退出' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'CmdOrCtrl+Z' },
        { label: '恢复', accelerator: 'CmdOrCtrl+Y' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X' },
        { label: '复制', accelerator: 'CmdOrCtrl+C' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V' },
        { type: 'separator' },
        { label: '查找', accelerator: 'CmdOrCtrl+F' },
        { label: '替换', accelerator: 'CmdOrCtrl+H' },
        { type: 'separator' },
        { label: '在文件中查找', accelerator: 'Shift+CmdOrCtrl+F' },
        { label: '在文件中替换', accelerator: 'Shift+CmdOrCtrl+H' },
        { type: 'separator' },
        { label: '切换行注释', accelerator: 'CmdOrCtrl+/' },
        { label: '切换块注释', accelerator: 'Shift+CmdOrCtrl+A' },
        { label: 'Emmet:展开缩写', accelerator: 'Tab' },
        { label: 'Emmet…' }
      ]
    },
    {
      label: '选择',
      submenu: [
        {
          label: '操作',
          click() { }
        }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(topLevelItems))
}

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
  createMenu()
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