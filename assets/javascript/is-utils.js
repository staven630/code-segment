/**
 * @param {any} obj 要检查的对象.
 * @returns {boolean} 测试对象是否是纯粹的对象（通过 "{}" 或者 "new Object" 创建的）
 */

export const isPlainObject = (value) => {
  if (!value || typeof value !== 'object' || ({}).toString.call(value) != '[object Object]') {
    return false;
  }
  var proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object);
}
