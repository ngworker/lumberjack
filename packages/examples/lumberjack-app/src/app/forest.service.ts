import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForestService implements OnDestroy {
  #fire$ = new ReplaySubject<void>(1);

  fire$ = this.#fire$.asObservable();

  constructor() {
    setTimeout(() => this.#fire$.next(), 2000);
  }

  ngOnDestroy(): void {
    this.#fire$.complete();
  }
}
