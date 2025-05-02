export function stopPropagation(e: any) {
  e.stopPropagation && e.stopPropagation();
}

export const preventDefault = (e: any, isStopPropagation?: boolean) => {
  e.preventDefault && e.preventDefault();
  if (isStopPropagation) {
    stopPropagation(e);
  }
};
