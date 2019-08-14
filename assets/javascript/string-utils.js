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

