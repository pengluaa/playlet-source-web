function isWindow(val: any) {
  return val === window;
}

// get nearest scroll element
const overflowScrollReg = /scroll|auto/i;
export function getScroller(el: any, root = window) {
  let node = el;

  while (
    node &&
    node.tagName !== 'HTML' &&
    node.nodeType === 1 &&
    node !== root
  ) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowScrollReg.test(overflowY)) {
      if (node.tagName !== 'BODY') {
        return node;
      }

      const { overflowY: htmlOverflowY } = window.getComputedStyle(
        node.parentNode,
      );

      if (overflowScrollReg.test(htmlOverflowY)) {
        return node;
      }
    }
    node = node.parentNode;
  }

  return root;
}

export function getScrollTop(el?: Element): number {
  return el?.scrollTop ?? window.pageYOffset;
}

export function setScrollTop(el: Element | Window, value: number): void {
  if ('scrollTop' in el) {
    el.scrollTop = value;
  } else {
    el.scrollTo(0, value);
  }
}

export function getRootScrollTop() {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

export function setRootScrollTop(value: number) {
  setScrollTop(window, value);
  setScrollTop(document.body, value);
}

// get distance from element top to page top or scroller top
export function getElementTop(el: Element, scroller: Element) {
  if (isWindow(el)) {
    return 0;
  }

  const scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop();
  return el.getBoundingClientRect().top + scrollTop;
}

export function getVisibleHeight(el: any) {
  if (isWindow(el)) {
    return el.innerHeight;
  }
  return el?.getBoundingClientRect().height;
}

export function getVisibleTop(el: any) {
  if (isWindow(el)) {
    return 0;
  }
  return el?.getBoundingClientRect()?.top;
}

export function getScrollHeight(el: any) {
  if (isWindow(el)) {
    return document.body.scrollHeight;
  }
  return el?.scrollHeight;
}
