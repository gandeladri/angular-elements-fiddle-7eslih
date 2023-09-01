import { Injectable } from '@angular/core';
import { TimerService } from './timer.service';

@Injectable({
  providedIn: 'root',
})
export class TimerManagerService {
  public timerDone1: string = '';
  public timerDone2: string = '';
  private timerDurationMilliseconds = 1000; // Duración fija de 1 segundo

  constructor(private timerService: TimerService) {}

  startTimer1() {
    this.timerService.startTimer(
      'timer1',
      this.timerDurationMilliseconds,
      () => {
        console.log('Temporizador 1 iniciado.');
      },
      () => {
        console.log('Temporizador 1 completado.');
        this.timerDone1 = 'Timer 1 Done!';
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
      },
      () => {
        console.log('Temporizador 2 completado.');
        this.timerDone2 = 'Timer 2 Done!';
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
