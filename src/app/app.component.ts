import { Component, OnDestroy } from '@angular/core';
import { IntervalManagerService } from './interval-manager.service';
import { TimerManagerService } from './timer-manager.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  constructor(
    public timerManagerService: TimerManagerService,
    public intervalManagerService: IntervalManagerService
  ) {}

  ngOnDestroy(): void {
    this.timerManagerService.ngOnDestroy();
    this.intervalManagerService.ngOnDestroy();
  }
}
