

/**
 *  监听文件/文件夹变化
 * @param {*} dir 文件目录 
 * @param {Function} cb 变化回调
 */
export function watch(dir, cb = () => { }) {
  import chokidar from 'chokidar'
  chokidar.watch(dir, { ignored: /(^|[\/\\])\../ })
    .on('change', (event, path) => {
      cb(event, path)
    })
}

/**
 * 启动子进程执行命令
 * @param {String} cmd 操作命令 
 */
export function exec(cmd) {
  return require('child_process').execSync(cmd).toString('utf8').trim()
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