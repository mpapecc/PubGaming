import { Injectable, Type, ViewContainerRef } from '@angular/core';
import { FlyoutComponent } from '../infrastructure/flyout/flyout.component';
import { BehaviorSubject, Observable, skip, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlyoutService {
  private flyoutsContainerRef!:ViewContainerRef;
  
  setFlyoutContainerRef(flyoutsContainerRef: ViewContainerRef){
    this.flyoutsContainerRef = flyoutsContainerRef;
  }

  public create<T>(component: Type<T>):Observable<T>{
    let flyout = this.flyoutsContainerRef.createComponent(FlyoutComponent);

    flyout.instance.contentComponent = component;
    flyout.instance.destroy = () => flyout.destroy();

    return flyout.instance.componentObserverable.pipe(skip(1)); 
  }

  public closeAll(){
    this.flyoutsContainerRef.clear()
  }
}
