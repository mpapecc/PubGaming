import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { timer } from 'rxjs/internal/observable/timer';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  protected TIMEOUT:number = 3000;
  toastMessage:string = ""
  timer: Observable<0> = timer(this.TIMEOUT);
  timerSubscription!:Subscription

  showToast(message:string){
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.closeToast();
    this.toastMessage = message;
    
    this.timerSubscription = this.timer.subscribe(() => {
      this.closeToast();
    });
  }

  closeToast(){
    this.toastMessage = ""
  }
}
