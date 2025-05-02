import { message } from 'antd';
import { Dayjs } from 'dayjs';
import * as XLSX from 'xlsx';
import { BookType } from 'xlsx';

export const getObjectType = function (obj: object): string {
  return Object.prototype.toString.call(obj).slice(8, -1);
};
/**
 * @description 判断对象
 * @returns {boolean}
 */
export const isObject = function (obj: object): boolean {
  return getObjectType(obj) === 'Object';
};
/**
 * @description 判断数组
 * @returns {boolean}
 */
export const isArray = function (obj: object): boolean {
  return getObjectType(obj) === 'Array';
};

/**
 * @description 获取随机整数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number}
 */
export const getRadomInt = function (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 随机数
export const getRandomString = (len?: number) => {
  const MAX = 10;
  if (!len || len > MAX) {
    len = MAX;
  }
  return Math.random()
    .toString(32)
    .slice(2, len + 2);
};

export const getQueryString = function (name: string, url?: string): string {
  let searchStr = '';
  let opt: any = null;
  // 传入url
  try {
    opt = new URL(url ?? document.URL);
  } catch (error) {
    opt = window.location;
  }
  searchStr = opt.search.substr(1) || opt.hash.split('?')[1] || '';
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  let r = searchStr.match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return '';
};

export const getSamePathName = (path1: string, path2: string): boolean => {
  let pathName1 = '';
  let pathName2 = '';
  try {
    pathName1 = new URL(path1).pathname;
  } catch (error) {
    return false;
  }
  try {
    pathName2 = new URL(path2).pathname;
  } catch (error) {
    return false;
  }
  return pathName1 === pathName2;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const deepCopy = (obj: any) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    return obj;
  }
};

/**
 * @description 设置剪贴板（复制文字）
 * @param {String} data
 */
export const setClipBoard = (
  data: any,
  msg?: string,
  showMsg?: boolean,
): void => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(data);
  } else {
    const delay = 100;
    const textNode = document.createElement('div');
    textNode.innerText = data;
    textNode.id = '_COPYTXT_';
    textNode.style.opacity = '0';
    textNode.style.position = 'fixed';
    document.body.append(textNode);
    setTimeout(() => {
      const range = document.createRange();
      const text: any = document.querySelector('#_COPYTXT_');
      range.selectNode(text);
      const selection: any = window.getSelection();
      if (selection.rangeCount > 0) selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('Copy');
      textNode.remove();
    }, delay);
  }
  if (showMsg !== false) {
    message.success(msg || '复制成功');
  }
};

/**
 * @description 获取图片宽高
 * @param {String} src
 * @returns {Object}
 */
export const getImgStyle = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
  });
};

/**
 * @description 导出excle文件
 * @param data data 为对象数组，对象key值对应fileds每一项
 * @param fileds 表格表头
 * @param filename 导出文件明
 * demo:
 * data = [{平台货号: 123456}, {平台货号: 789456}]
 * fileds = ['平台货号']
 */
export const exportDocument = (
  data: any[],
  filename: string,
  addtime: boolean = true,
  format: BookType = 'xlsx',
  fileds?: string[],
): any => {
  let worksheet: any;
  // 是否需要时间后缀
  const time: string = addtime ? new Date().toLocaleDateString() : '';
  const item = data[0];
  // 根据数格式选择导出方式
  if (Array.isArray(item)) {
    worksheet = XLSX.utils.aoa_to_sheet(data);
  } else {
    worksheet = XLSX.utils.json_to_sheet(data, {
      header: fileds,
    });
  }
  // 判断是否传入文件格式
  const fileType = ['xls', 'xlsx', 'csv'];
  const fileNmae = filename.split('.');
  if (fileType.indexOf(fileNmae[fileNmae.length - 1]) == -1) {
    filename = `${filename}${time}.${format}`;
  }
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet);
  // generate Blob
  const wbout = XLSX.write(workbook, { bookType: format, type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  // save file
  let link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(function () {
    // 延时释放掉obj
    URL.revokeObjectURL(link.href);
    link.remove();
  }, 500);
};

export const formatData = (data: any): any[] => {
  const headerKeys = Object.keys(data.header);
  const headerValues = Object.values(data.header);
  const values = data.data;
  const arr = [];

  arr.push(headerValues);
  for (const item of values) {
    const row = [];
    for (const key of headerKeys) {
      row.push(item[key] ?? '');
    }
    arr.push(row);
  }
  return arr;
};

export const formatTime = (time: Dayjs, formatStr?: string): string => {
  if (!time) {
    return '';
  }

  return time.format(formatStr ?? 'YYYY-MM-DD HH:mm:ss');
};

export const arrTimeToString = (
  times: any,
  formatStr?: string,
  space?: string,
): string => {
  if (times instanceof Array) {
    const [start, end] = times;
    return `${formatTime(start, formatStr)}${space || '~'}${formatTime(
      end,
      formatStr,
    )}`;
  }
  return formatTime(times, formatStr);
};

// 数值对象去重
export const deduplication = (arr: any[], key: string): any[] => {
  const map = new Map<string, boolean>();
  return arr.filter((item) => !map.has(item[key]) && map.set(item[key], true));
};

// 获取文件格式
export const getExt = (src?: string): string => {
  return ((src ?? '').split('.').pop() || 'unknown').toLowerCase();
};

// 是否是图片
export const isImageUrl = (src?: string): boolean => {
  return ['jpg', 'png', 'jpeg', 'gif'].some((type) => type === getExt(src));
};

// 是否是视频
export const isVideoUrl = (src?: string): boolean => {
  return ['mp4', 'mov', 'flv', 'avi', 'm3u8'].some(
    (type) => type === getExt(src),
  );
};

// 文件预览
export const previewFile = (src: string): void => {
  const docExt = ['doc', 'docx', 'xls', 'xlsx'];
  const ext = getExt(src);
  if (docExt.some((v) => v === ext)) {
    window.open(
      `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        src,
      )}`,
    );
  } else {
    window.open(src);
  }
};

const getImage = (image: any) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d') as any;
  ctx.drawImage(image, 0, 0, image.width, image.height);
  // 获取图片后缀名
  const extension = image.src
    .substring(image.src.lastIndexOf('.') + 1)
    .toLowerCase();
  // 某些图片 url 可能没有后缀名，默认是 png
  return canvas.toDataURL('image/' + extension, 1);
};

export const downloadFile = (src: string, downloadName: string = '') => {
  if (isImageUrl(src)) {
    const link = document.createElement('a');
    link.setAttribute('download', downloadName);
    const image = new Image();
    // 添加时间戳，防止浏览器缓存图片
    image.src = src + '?timestamp=' + new Date().getTime();
    // 设置 crossOrigin 属性，解决图片跨域报错
    image.setAttribute('crossOrigin', 'Anonymous');
    image.onload = () => {
      link.href = getImage(image);
      link.click();
    };
  } else {
    window.open(src);
  }
};

/**
 * @desc 密码校验
 * @param password
 * @returns boolean
 */
export const validatePassword = (password: string): boolean => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,21}$/.test(password);
};

/**
 * @desc 下划线转驼峰
 * @param name string
 * @returns string
 */
export const toCamel = (name: string): string => {
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
};

/**
 * @desc 驼峰转下划线
 * @param name string
 * @returns string
 */
export const toLowerLine = (name: string): string => {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
};

/**
 * @desc 数字四舍五入
 * @param number number 数字
 * @param precision number 精度
 * @returns number
 */
export const round = (number: number, precision: number = 2) => {
  return (
    Math.round(+number * Math.pow(10, precision)) / Math.pow(10, precision)
  );
};

/**
 * @desc 生成随机手机号
 * @returns string
 */
export const genMobile = () => {
  // 新疆号码
  const prefixArray = [
    '1300966',
    '1313978',
    '1327903',
    '1500142',
    '1366757',
    '1377914',
    '1389918',
    '1500162',
    '1516092',
    '1569924',
  ];
  const prefixStr = prefixArray[getRadomInt(0, prefixArray.length - 1)];
  const suffixStr = new Array(4)
    .fill(null)
    .map(() => getRadomInt(0, 9))
    .join('');
  return prefixStr + suffixStr;
};

export const buildTree = (
  data: any[],
  idKey: string,
  pIdKey: string,
): any[] => {
  const map = new Map();
  const tree: any[] = [];
  // 将数据放入 map 中，id 为键
  data.forEach((item) => {
    map.set(item[idKey], item);
  });
  // 构建树形结构
	for (let i = 0; i < data.length; i++) {
		const item = data[i];
		// 如果 pid 为 0，说明是根节点
		if (item[pIdKey] === 0) {
			tree.push(map.get(item[idKey]));
			continue;
		}
		// 否则，找到父节点并将当前项放入其 children 中
		const pItem = map.get(item[pIdKey]);
		if (!pItem) continue
		if (!pItem.children) {
			pItem.children = [];
		}
		pItem.children.push(map.get(item[idKey]));
	}

  return tree;
};
