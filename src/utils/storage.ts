import { getObjectType } from './util';

const getStorageFn = (sesseion: boolean): Storage => {
  return sesseion ? window.sessionStorage : window.localStorage;
};

/**
 * @description get storage
 * @param {String} key
 * @param {Boolean} sesseion
 */
export const getStorage = <T>(key: string, sesseion = false): T | null => {
  try {
    const storage = getStorageFn(sesseion);
    const value = storage.getItem(key);
    if (value === null) {
      return value as T;
    }
    const obj = JSON.parse(value);
    // if (obj.type === 'Number') {
    //   return Number(obj.value);
    // }
    return obj.value;
  } catch (error) {
    return null;
  }
};

/**
 * @description set storage
 * @param {String} key
 * @param {Any} value
 * @param {Boolean} sesseion
 */
export const setStorage = (key: string, value: any, sesseion = false) => {
  try {
    const storage = getStorageFn(sesseion);
    const type = getObjectType(value);
    const data = JSON.stringify({
      type: type,
      value: value,
    });
    storage.setItem(key, data);
  } catch (error) {
    console.log('set storage error', error);
  }
};

/**
 * @description remove storage
 * @param {String} key
 */
export const removeStorage = (key: string, sesseion = false) => {
  const storage = getStorageFn(sesseion);
  storage && storage.removeItem(key);
};
