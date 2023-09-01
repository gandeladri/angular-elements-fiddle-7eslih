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
      onStart?: () => void;
      onComplete?: () => void;
    };
  } = {};
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-empty-function
  private emptyFunction: () => void = () => {};

  startTimer(
    key: string,
    milliseconds: number,
    onStart?: () => void,
    onComplete?: () => void,
    restarting = false
  ): void {
    // Save onStart, onComplete functions before cancelling if required
    if (restarting) {
      onStart = this.timers[key]?.onStart ?? this.emptyFunction;
      onComplete = this.timers[key]?.onComplete ?? this.emptyFunction;
    } else if (key in this.timers) {
      // Try to replace onStart, onComplete functions with whatever comes on parameters
      // only if running startTimer method while the timer hasn't finished yet.
      onStart = onStart
        ? onStart
        : this.timers[key]?.onStart ?? this.emptyFunction;
      onComplete = onComplete
        ? onComplete
        : this.timers[key]?.onComplete ?? this.emptyFunction;
    }
    if (restarting || key in this.timers) {
      this.cancelTimer(key);
    }
    if (onStart) {
      onStart();
    }
    const onDestroy$ = new Subject<void>();
    const timer$ = timer(milliseconds)
      .pipe(takeUntil(onDestroy$))
      .subscribe(() => {
        if (key in this.timers) {
          const completedTimer = this.timers[key];
          if (completedTimer.onComplete) {
            completedTimer.onComplete();
          }
        }
      });
    this.timers[key] = { timer$, onDestroy$, onStart, onComplete };
  }

  cancelTimer(key: string): void {
    const timerItem = this.timers[key];
    if (timerItem) {
      timerItem.timer$.unsubscribe();
      timerItem.onDestroy$.next();
      timerItem.onDestroy$.complete();
      delete this.timers[key];
    }
  }

  resetTimer(key: string, milliseconds: number): void {
    this.startTimer(key, milliseconds, undefined, undefined, true);
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
