import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-set-card',
  templateUrl: './set-card.component.html',
  styleUrls: ['./set-card.component.css']
})
export class SetCardComponent {
@Input() set:any
}
