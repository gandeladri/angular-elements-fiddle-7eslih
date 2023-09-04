import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TimerManagerService } from './timer-manager.service';
import { MyComponent } from './MyComponent';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpModule],
  declarations: [AppComponent, HelloComponent, MyComponent],
  bootstrap: [AppComponent],
  providers: [TimerManagerService]
})
export class AppModule { }
