import { Injectable, OnDestroy } from '@angular/core';
import { timer, Subscription, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IntervalService implements OnDestroy {
  private intervals: {
    [key: string]: {
      interval$: Subscription;
      iterations: number;
      onDestroy$: Subject<void>;
      onIterationFinish?: () => void;
    };
  } = {};
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-empty-function
  private emptyFunction: () => void = () => {};

  /**
   * Start Interval
   * @param key The interval key.
   * @param milliseconds Duration in milliseconds.
   * @param onIterationFinish Function that executes every iteration.
   * @param iterations Iterations count. If 0 then it will run indefintely until destroyed.
   */
  startInterval(
    key: string,
    milliseconds: number,
    onIterationFinish?: () => void,
    iterations?: number
  ): void {
    if (key in this.intervals) {
      onIterationFinish = onIterationFinish
        ? onIterationFinish
        : this.intervals[key]?.onIterationFinish ?? this.emptyFunction;
      this.cancelInterval(key);
    }
    const onDestroy$ = new Subject<void>();
    const actualIterations = iterations ? iterations : Infinity;
    const interval$ = timer(0, milliseconds)
      .pipe(takeUntil(onDestroy$), take(actualIterations))
      .subscribe(() => {
        if (key in this.intervals) {
          const completedInterval = this.intervals[key];
          if (completedInterval.onIterationFinish) {
            completedInterval.onIterationFinish();
          }
        }
      });
    this.intervals[key] = {
      interval$: interval$,
      iterations: actualIterations,
      onDestroy$,
      onIterationFinish: onIterationFinish,
    };
  }

  /**
   * Cancel Timer
   * @param key The interval key
   */
  cancelInterval(key: string): void {
    const item = this.intervals[key];
    if (item) {
      item.interval$.unsubscribe();
      item.onDestroy$.next();
      item.onDestroy$.complete();
      delete this.intervals[key];
    }
  }

  ngOnDestroy(): void {
    Object.keys(this.intervals).forEach((key) => {
      const item = this.intervals[key];
      item.interval$.unsubscribe();
      item.onDestroy$.next();
      item.onDestroy$.complete();
    });
  }
}
