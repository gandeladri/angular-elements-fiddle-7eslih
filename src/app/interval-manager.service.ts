import { OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { IntervalService } from './interval.service';

@Injectable({
  providedIn: 'root',
})
export class IntervalManagerService implements OnDestroy {
  constructor(private intervalService: IntervalService) {}

  onStartIntervals() {
    this.intervalService.startInterval('interval1', 1000, () => {
      console.log('finished iteration');
    });
  }

  ngOnDestroy(): void {
    console.log('destroying IntervalManagerService');
    this.intervalService.ngOnDestroy();
  }
}
