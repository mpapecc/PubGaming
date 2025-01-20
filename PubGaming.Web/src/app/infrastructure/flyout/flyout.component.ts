import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Flyout } from 'src/app/services/flyout.service';

@Component({
  selector: 'app-flyout',
  templateUrl: './flyout.component.html',
  styleUrls: ['./flyout.component.css']
})
export class FlyoutComponent implements OnInit, AfterViewInit {
  @ViewChild("contentComponentDiv", { read: ViewContainerRef }) contentComponentDiv!: ViewContainerRef;

  @Input() contentComponent!: any;
  @Output() backdropClickEvent: EventEmitter<any> = new EventEmitter();
  protected isOpen: boolean = false;
  flyoutData!: Flyout<any>;
  readonly componentBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.flyoutData?.content)
        return;

      this.flyoutData.closeFlyout = () => this.destroy();
      let componentRef = this.contentComponentDiv.createComponent(this.flyoutData.content);
      this.componentBehaviorSubject.next(componentRef.instance);
    })
  }

  ngOnInit(): void {
    setTimeout(() => this.isOpen = true);
  }

  protected backdropClick() {
    this.isOpen = false;
    setTimeout(() => {
      this.backdropClickEvent.emit();
      this.flyoutData?.onClose && this.flyoutData.onClose();
      this.destroy();
    }, 200);
  }

  destroy() { }
}
