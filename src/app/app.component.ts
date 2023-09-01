import { Component, OnDestroy } from '@angular/core';
import { TimerManagerService } from './timer-manager.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  constructor(public timerManagerService: TimerManagerService) {}

  ngOnDestroy(): void {
    this.timerManagerService.ngOnDestroy();
  }
}
