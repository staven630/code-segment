/**
 * Convert Strings from camelCase to kebab-case
 * @returns {string}
 * @param input
 */
export const camelToKebab = input => {
  return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * Convert Strings from kebab-case to camelCase
 * @returns {string}
 * @param input
 */
export const kebabToCamel = input => {
  return input.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase()
  })
}


/**
 * 随机生成长度为len的字符串
 * @returns {string} 
 * @param len 字符串长度
 */
export const randomString = (len) => Math.random().toString(36).substring(2, len + 2);

/**
 * 获取高亮分词列表
 * @param {string} keyword 关键字
 * @param {string} fulltext 整段文本
 */
export const getHighlightList = (keyword, fulltext) => {
  const reg = new RegExp(keyword, 'ig')
  const len = keyword.length;

  let list = []
  let item = []
  let prevIndex = 0;

  while ((item = reg.exec(fulltext)) !== null) {
    const curr = fulltext.substring(prevIndex, item.index)
    curr && list.push({ text: curr })
    list.push({ text: keyword, highlight: true })
    prevIndex = item.index + len
  }

  list.push({ text: fulltext.substring(prevIndex) })

  return list
}