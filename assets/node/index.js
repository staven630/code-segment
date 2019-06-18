

/**
 *  监听文件/文件夹变化
 * @param {*} dir 文件目录 
 * @param {Function} cb 变化回调
 */
export function watchDir(dir, cb = () => { }) {
  const watcher = require('chokidar').watch([dir])
  watcher.on('ready', function () {
    watcher.on('change', function () {
      // 执行变化操作
      cb();
    })
  })
}

/**
 * 启动子进程执行命令
 * @param {String} cmd 操作命令 
 */
export function exec(cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

/**
 * 判断路径是否存在，不存在则生成
 * @param {*} dir 
 * @param {Object} opts 
 */
export function statDir(dir, opts = {}) {
  const fs = require('fs')
  try {
    fs.statSync(dir)
  } catch (error) {
    require('mkdirp').sync(dir, opts)
  }
}