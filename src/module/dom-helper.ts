export function getAllParents(el: HTMLElement): HTMLElement[] {
  return el ? [el, ...getAllParents(el.parentElement)] : [];
}

export function getAllOffsetParents(el: HTMLElement): HTMLElement[] {
  return el ? [el, ...getAllOffsetParents(el.offsetParent as HTMLElement)] : [];
}

export function getFirstOffsetParent(el: HTMLElement): HTMLElement {
  return getAllOffsetParents(el)[1];
}

export function getLastOffsetParent(el: HTMLElement): HTMLElement {
  return getAllOffsetParents(el).pop();
}

export function getAbsoluteOffsetLeft(el: HTMLElement): number {
  return getAllOffsetParents(el)
    .map(e => e.offsetLeft)
    .reduce((res, offsetLeft) => res + offsetLeft, 0);
}

export function getAbsoluteOffsetTop(el: HTMLElement): number {
  return getAllOffsetParents(el)
    .map(e => e.offsetTop)
    .reduce((res, offsetLeft) => res + offsetLeft, 0);
}
