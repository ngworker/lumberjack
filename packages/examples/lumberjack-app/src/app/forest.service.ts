import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForestService implements OnDestroy {
  readonly #fire$ = new ReplaySubject<void>(1);

  readonly fire$ = this.#fire$.asObservable();

  constructor() {
    setTimeout(() => this.#fire$.next(), 2000);
  }

  ngOnDestroy(): void {
    this.#fire$.complete();
  }
}
