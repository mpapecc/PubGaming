import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() text: string = "";
  @Input() isDisabled: boolean = false;
  @Input() onClick: Function = () => {};
  @Input() onClickParams: Parameters<any> = [];
  @Input() type:string = "button";
}
