import { Injectable, OnDestroy } from '@angular/core';
import { timer, Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TimerService implements OnDestroy {
  private timers: {
    [key: string]: {
      timer$: Subscription;
      onDestroy$: Subject<void>;
      count: number;
      onStart?: () => void;
      onComplete?: () => void;
    };
  } = {};
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-empty-function
  private emptyFunction: () => void = () => {};

  /**
   * Start Timer
   * @param key The timer key
   * @param milliseconds Duration in milliseconds
   * @param count Number of times to repeat. If not set, or 0, will execute once.
   * @param onStart Function that executes before running timer
   * @param onComplete Function that executes after timer ran
   * @param resetting Reset timer and use previously defined start/complete functions
   */
  startTimer(
    key: string,
    milliseconds: number,
    count: number = 0,
    onStart?: () => void,
    onComplete?: () => void,
    resetting = false
  ): void {
    if (resetting) {
      onStart = this.timers[key]?.onStart ?? this.emptyFunction;
      onComplete = this.timers[key]?.onComplete ?? this.emptyFunction;
    } else if (key in this.timers) {
      onStart = onStart
        ? onStart
        : this.timers[key]?.onStart ?? this.emptyFunction;
      onComplete = onComplete
        ? onComplete
        : this.timers[key]?.onComplete ?? this.emptyFunction;
    }
    if (resetting || key in this.timers) {
      this.cancelTimer(key);
    }
    if (onStart) {
      onStart();
    }
    const onDestroy$ = new Subject<void>();
    const timer$ = timer(milliseconds, 1)
      .pipe(takeUntil(onDestroy$))
      .subscribe(() => {
        if (key in this.timers) {
          const completedTimer = this.timers[key];
          if (completedTimer.onComplete) {
            completedTimer.onComplete();
          }
        }
      });
    this.timers[key] = { timer$, onDestroy$, count, onStart, onComplete };
  }

  /**
   * Cancel Timer
   * @param key The timer key
   */
  cancelTimer(key: string): void {
    const timerItem = this.timers[key];
    if (timerItem) {
      timerItem.timer$.unsubscribe();
      timerItem.onDestroy$.next();
      timerItem.onDestroy$.complete();
      delete this.timers[key];
    }
  }

  /**
   * Restart timer and use previously defined start/complete functions
   * @param key The timer key
   * @param milliseconds Duration in milliseconds
   */
  resetTimer(key: string, milliseconds: number): void {
    this.startTimer(key, milliseconds, 1, undefined, undefined, true);
  }

  ngOnDestroy(): void {
    Object.keys(this.timers).forEach((key) => {
      const timerItem = this.timers[key];
      timerItem.timer$.unsubscribe();
      timerItem.onDestroy$.next();
      timerItem.onDestroy$.complete();
    });
  }
}
