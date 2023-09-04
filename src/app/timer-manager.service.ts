import { Injectable } from '@angular/core';
import { TimerService } from './timer.service';

@Injectable({
  providedIn: 'root',
})
export class TimerManagerService {
  public timerDone1: string = '';
  public timerDone2: string = '';
  public timer1Interval: number = 0;
  public timer2Interval: number = 0;
  private timerDurationMilliseconds = 1000; // Duración fija de 1 segundo

  constructor(private timerService: TimerService) {}

  startTimer1() {
    this.timerService.startTimer(
      'timer1',
      this.timerDurationMilliseconds,
      () => {
        console.log('Temporizador 1 iniciado.');
        this.timerDone1 = `Timer 1 is running! - Interval: ${++this
          .timer1Interval}`;
      },
      () => {
        console.log('Temporizador 1 completado.');
        this.timerDone1 = `Timer 1 Done! - Interval: ${this.timer1Interval}`;
      }
    );
  }

  cancelTimer1() {
    this.timerService.cancelTimer('timer1');
    this.timerDone1 = '';
  }

  resetTimer1() {
    this.timerService.resetTimer('timer1', this.timerDurationMilliseconds);
  }

  startTimer2() {
    this.timerService.startTimer(
      'timer2',
      this.timerDurationMilliseconds,
      () => {
        console.log('Temporizador 2 iniciado.');
        this.timerDone2 = `Timer 2 is running! - Interval: ${++this
          .timer2Interval}`;
      },
      () => {
        console.log('Temporizador 2 completado.');
        this.timerDone2 = `Timer 2 Done! - Interval: ${this.timer2Interval}`;
      }
    );
  }

  cancelTimer2() {
    this.timerService.cancelTimer('timer2');
    this.timerDone2 = '';
  }

  resetTimer2() {
    this.timerService.resetTimer('timer2', this.timerDurationMilliseconds);
  }

  ngOnDestroy() {
    this.timerService.ngOnDestroy();
  }
}
