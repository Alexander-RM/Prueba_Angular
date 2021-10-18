import { NgModule } from '@angular/core';
import { LoadingComponent } from './loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MessageComponent } from './message/message.component';

@NgModule({
  declarations: [LoadingComponent, MessageComponent],
  imports: [MatProgressSpinnerModule],
  exports: [LoadingComponent, MessageComponent]
})
export class UtilsComponentModule { }
