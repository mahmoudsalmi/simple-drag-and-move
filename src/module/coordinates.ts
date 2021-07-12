import {getAbsoluteOffsetLeft, getAbsoluteOffsetTop} from './dom-helper';

export class Coordinates {
  constructor(
    public top: number,
    public left: number,
    public width: number = 0,
    public height: number = 0,
  ) {
  }

  static parse(el: HTMLElement): Coordinates {
    return new Coordinates(getAbsoluteOffsetTop(el), getAbsoluteOffsetLeft(el), el.offsetWidth, el.offsetHeight);
  }

  static copy(coordinates: Coordinates): Coordinates {
    return new Coordinates(coordinates.top, coordinates.left, coordinates.width, coordinates.height);
  }

  static distance(current: Coordinates, start: Coordinates): Coordinates {
    return new Coordinates(current.top - start.top, current.left - start.left);
  }

  get right(): number {
    return this.left + this.width;
  }

  get bottom(): number {
    return this.top + this.height;
  }

  print(): string {
    return `[ ${this.top}, ${this.right}, ${this.bottom}, ${this.left} ]`;
  }
}
