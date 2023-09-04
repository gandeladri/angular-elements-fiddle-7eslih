import { Component, OnDestroy } from '@angular/core';
import { timer, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-component',
  template: '<p>Times: {{ times }}</p>',
})
export class MyComponent implements OnDestroy {
  times: number = 0;
  limit: number = 10;
  delayMs: number = 1000;
  private onDestroy$ = new Subject<void>();
  private timer$: Subscription;

  constructor() {
    this.timer$ = timer(1000) // Emit every 1 second for 1000 times
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.times++;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    if (this.timer$) {
      this.timer$.unsubscribe();
    }
  }
}
