import {
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';

class Point {
  x = 0;
  y = 0;
}

@Directive({
  selector: '[appDraggable]',
  standalone: true,
})
export class DraggableDirective implements OnInit {
  private elementRef = inject(ElementRef);

  private ele = this.elementRef.nativeElement as HTMLElement;
  private initial: Point = { x: 0, y: 0 };
  private current: Point = { x: 0, y: 0 };
  private isDragging = signal(false);

  _ = effect(() => {
    this.ele.style.boxShadow = this.isDragging() ? '2px 2px gray' : '';
    if (this.isDragging()) this.ele.classList.add('dragging');
    else this.ele.classList.remove('dragging');
  });

  constructor() {}
  ngOnInit(): void {
    this.ele.style.cursor = 'move';
  }

  @HostListener('mousedown', ['$event']) dragStart(ev: MouseEvent) {
    this.initial = {
      x: ev.clientX - this.current.x,
      y: ev.clientY - this.current.y,
    };
    this.isDragging.set(true);
  }

  @HostListener('mousemove', ['$event']) drag(ev: MouseEvent) {
    //todo do weider
    this.initial = {
      x: ev.clientX - this.current.x,
      y: ev.clientY - this.current.y,
    };
    this.isDragging.set(true);
  }
}
