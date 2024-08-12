import { Signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Observable, switchMap } from 'rxjs';

export function computedAsync<T, U>(sig: Signal<T>, fct: (p: T) => Observable<U>): Signal<U | undefined> {
  return toSignal(
    toObservable(sig)
      .pipe(
        switchMap(x => fct(x))
      )
  )
}