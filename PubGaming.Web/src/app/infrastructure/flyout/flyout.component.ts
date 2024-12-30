import { AfterViewInit, Component, ComponentRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-flyout',
  templateUrl: './flyout.component.html',
  styleUrls: ['./flyout.component.css']
})
export class FlyoutComponent implements OnInit, AfterViewInit {
  @ViewChild("contentComponentDiv", {read: ViewContainerRef}) contentComponentDiv!: ViewContainerRef;

  @Input() isSmall: boolean = false;
  @Input() contentComponent!: any;
  @Output() backdropClickEvent: EventEmitter<any> = new EventEmitter();
  isOpen: boolean = false;

  componentObserverable:BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      let aaa = this.contentComponentDiv.createComponent(this.contentComponent);
    this.componentObserverable.next(aaa.instance);
    })
  }

  ngOnInit(): void {
    setTimeout(() => this.isOpen = true);
  }



  protected backdropClick() {
    this.isOpen = false;
    setTimeout(() => {
      this.backdropClickEvent.emit();
      this.onBackdropClick();
      this.destroy();
    }, 200);
  }

  destroy() { }
  onBackdropClick() { }
}
