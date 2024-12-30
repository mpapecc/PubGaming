import { AfterViewInit, Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ErrorDisplayService } from './services/error-display.service';
import { LoaderService } from './services/loader.service';
import { FlyoutService } from './services/flyout.service';
import { SetFormComponent } from './forms/set-form/set-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'PubGaming.Web';

  @ViewChild("flyouts", {read: ViewContainerRef}) flyouts!: ViewContainerRef;

  constructor(
    public errorDisplayService: ErrorDisplayService,
    public loaderService: LoaderService,
    public flyoutService:FlyoutService
  ){}

  ngAfterViewInit(): void {
    this.flyoutService.setFlyoutContainerRef(this.flyouts);
  }
}
