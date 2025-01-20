import { Component } from '@angular/core';
import { ErrorDisplayService } from 'src/app/services/error-display.service';

@Component({
  selector: 'app-error-display',
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.css']
})
export class ErrorDisplayComponent{

  constructor(public errorDisplayService: ErrorDisplayService) { }
}
