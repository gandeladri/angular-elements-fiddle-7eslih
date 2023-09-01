import { Injectable } from '@angular/core';
import { timer, Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timers: {
    [key: string]: {
      timer$: Subscription;
      onDestroy$: Subject<void>;
      onStart: () => void | undefined;
      onComplete: () => void | undefined;
    };
  } = {};
  private emptyFunction = () => {};

  startTimer(
    key: string,
    milliseconds: number,
    onStart?: () => void,
    onComplete?: () => void,
    restarting: boolean = false
  ): void {
    if (restarting) {
      onStart = this.timers[key]?.onStart ?? this.emptyFunction;
      onComplete = this.timers[key]?.onComplete ?? this.emptyFunction;
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
        if (this.timers[key]?.onComplete) {
          this.timers[key].onComplete();
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
