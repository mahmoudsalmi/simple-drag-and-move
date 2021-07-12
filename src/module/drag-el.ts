import {getFirstOffsetParent} from './dom-helper';
import {fromEvent, Observable, Subject} from 'rxjs';
import {isEqual} from 'lodash-es';

import {distinctUntilChanged, map, switchMap, takeUntil} from 'rxjs/operators';
import {DragCoordinates} from './drag-coordinates';
import {Coordinates} from './coordinates';

export class DragEl {

  public elCoordinates: DragCoordinates;

  public container: HTMLElement;
  public containerCoordinates: Coordinates;

  private _downEvt$: Subject<Coordinates> = new Subject<Coordinates>();
  public startGrab$: Observable<Coordinates> = this._downEvt$.asObservable();

  private _moveEvt$: Subject<Coordinates> = new Subject<Coordinates>();
  public moving$: Observable<Coordinates> = this._moveEvt$.asObservable();

  private _upEvt$: Subject<Coordinates> = new Subject<Coordinates>();
  public stopGrab$: Observable<Coordinates> = this._upEvt$.asObservable();


  constructor(
    public el: HTMLElement,
    container: HTMLElement = null
  ) {
    this.container = container ? container : getFirstOffsetParent(el);
    this.containerCoordinates = Coordinates.parse(container);

    this.elCoordinates = new DragCoordinates(el, this.containerCoordinates);

    const down$: Observable<Coordinates> = fromEvent(el, 'mousedown').pipe(
      map((downEvt: MouseEvent) => this.startGrab(downEvt))
    );

    const move$: Observable<Coordinates> = fromEvent(this.container, 'mousemove').pipe(
      map((moveEvt: MouseEvent) => this.move(moveEvt)),
      distinctUntilChanged((x, y) => isEqual(x, y))
    );

    const up$: Observable<Coordinates> = fromEvent(document, 'mouseup').pipe(
      map((upEvt: MouseEvent) => this.stopGrab(upEvt))
    );

    down$.pipe(
      switchMap(() => move$.pipe(takeUntil(up$)))
    ).subscribe(
      (newPosition: Coordinates) => {
        this.el.style.top = `${newPosition.top}px`;
        this.el.style.left = `${newPosition.left}px`;
      }
    );
  }

  private startGrab(downEvt: MouseEvent): Coordinates {
    this._downEvt$.next(Coordinates.copy(this.elCoordinates.coordinates));
    return this.elCoordinates.startGrab(downEvt.pageY, downEvt.pageX, this.containerCoordinates);
  }

  private stopGrab(upEvt: MouseEvent): Coordinates {
    this.elCoordinates.stopGrab();
    this._upEvt$.next(Coordinates.copy(this.elCoordinates.coordinates));
    return new Coordinates(upEvt.pageY, upEvt.pageX);
  }

  private move(moveEvt: MouseEvent): Coordinates {
    const newPosition = this.elCoordinates.move(moveEvt.pageY, moveEvt.pageX);
    this._moveEvt$.next(Coordinates.copy(newPosition));
    return newPosition;
  }
}
