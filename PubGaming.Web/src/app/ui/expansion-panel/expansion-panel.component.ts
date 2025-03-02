import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.css']
})
export class ExpansionPanelComponent {
  @Input() text: string = "";
  isExpanded: boolean = false;

  toggleIsExpanded = () => this.isExpanded = !this.isExpanded;
}
