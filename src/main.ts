import {DragEl} from './module/drag-el';
import {debounceTime, map, take} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {Coordinates} from './module/coordinates';

console.clear();

// ------------------------------------------------------------------------------------------------------------------------------------- Simple
const el: HTMLElement = document.querySelector('.drag-el');
const container: HTMLElement = document.querySelector('.drag-container');

let dragEl = new DragEl(el, container);

dragEl.startGrab$.subscribe(() => el.classList.add('grabbing'));
dragEl.stopGrab$.subscribe(() => el.classList.remove('grabbing'));

combineLatest([
  dragEl.startGrab$.pipe(take(1)),
  dragEl.moving$.pipe(debounceTime(100))
]).pipe(
  map(([start, newPosition]: [start: Coordinates, current: Coordinates]) => Coordinates.distance(newPosition, start))
).subscribe(distance => console.log('simple : ', distance.print()));

// ------------------------------------------------------------------------------------------------------------------------------------- Scroll
const scrollEl: HTMLElement = document.querySelector('.drag-scroll-el');
const scrollContainer: HTMLElement = document.querySelector('.drag-scroll-container');

let dragScrollEl = new DragEl(scrollEl, scrollContainer);

dragScrollEl.startGrab$.subscribe(() => scrollEl.classList.add('grabbing'));
dragScrollEl.stopGrab$.subscribe(() => scrollEl.classList.remove('grabbing'));

combineLatest([
  dragScrollEl.startGrab$.pipe(take(1)),
  dragScrollEl.moving$.pipe(debounceTime(100))
]).pipe(
  map(([start, newPosition]: [start: Coordinates, current: Coordinates]) => Coordinates.distance(newPosition, start))
).subscribe(distance => console.log('scroll : ', distance.print()));
