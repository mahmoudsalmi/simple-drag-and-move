import {Coordinates} from './coordinates';

export class DragCoordinates {

  public coordinates: Coordinates;
  public startCoordinates: Coordinates;

  private moving: boolean = false;
  public newPosition: Coordinates = new Coordinates(0, 0);
  public limits: Coordinates;

  constructor(
    public el: HTMLElement,
    limits: Coordinates = new Coordinates(0, 0)
  ) {
    this.coordinates  = Coordinates.parse(el);
    this.coordinates.top = this.coordinates.top - limits.top;
    this.coordinates.left = this.coordinates.left - limits.left;
  }

  startGrab(pointerTop: number, pointerLeft: number, limits: Coordinates): Coordinates {
    this.limits = limits;
    this.moving = true;
    this.startCoordinates = new Coordinates(pointerTop, pointerLeft);
    return this.startCoordinates;
  }

  move(pointerTop: number, pointerLeft: number): Coordinates {
    if (!this.moving) {
      return this.newPosition;
    }
    const pointerDistance = this.getPointerDistance(pointerTop, pointerLeft);
    this.newPosition = DragCoordinates.calculateDistance(this.coordinates, this.limits, pointerDistance);
    return this.newPosition;
  }

  getPointerDistance(pointerTop: number, pointerLeft: number): Coordinates {
    const pointerCoordinates = new Coordinates(pointerTop, pointerLeft);
    return Coordinates.distance(pointerCoordinates, this.startCoordinates);
  }

  stopGrab(): void {
    this.coordinates.top = this.newPosition.top;
    this.coordinates.left = this.newPosition.left;

    this.startCoordinates = new Coordinates(0, 0);
  }

  print(): string {
    return `${this.el.tagName}.${this.el.classList.toString()} ${this.coordinates.print()}`;
  }

  static calculateDistance(el: Coordinates, limits: Coordinates, pointerDistance: Coordinates): Coordinates {
    const newEl = new Coordinates(el.top + pointerDistance.top, el.left + pointerDistance.left, el.width, el.height);

    if (newEl.top < 0) {
      newEl.top = 0;
    }

    if (newEl.right > limits.width) {
      newEl.left = limits.width - el.width;
    }

    if (newEl.bottom > limits.height) {
      newEl.top = limits.height - el.height;
    }

    if (newEl.left < 0) {
      newEl.left = 0;
    }

    return newEl;
  }
}
