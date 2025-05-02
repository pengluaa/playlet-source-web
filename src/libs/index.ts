import { getElementTop, getScroller } from '@/utils/scroll';

export const scrollToFirstError = (): void => {
  setTimeout(() => {
    // 调用原生滚动
    const errEl = document.querySelector(
      '.ant-form-item-explain-error',
    ) as HTMLElement;
    const scroller = getScroller(errEl);
    const antFormItemH = 56;
    scroller?.scrollTo({
      left: 0,
      top: getElementTop(errEl, scroller) - scroller.offsetTop - antFormItemH,
    });
  }, 100);
};

export const getFileUrl = (url?: string): string => {
  if (!url) return '';

  if (url.startsWith('http') || url.startsWith('https')) return url;
  return FILE_URL + '/' + url;
};
