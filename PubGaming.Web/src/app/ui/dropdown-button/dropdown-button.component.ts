import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.css']
})
export class DropdownButtonComponent {
  @Input() text: string = "Dropdown"
  isHidden: boolean = true;

  constructor(){
    document.addEventListener('click', (event) => {
      let element = event.target as HTMLElement;
      let className = element.parentElement?.className;
      
      if(className !== "button-text" && className !== "button-expand-dropdown")
        this.isHidden = true;
    });
  }

  toggleIsHidden = () => this.isHidden = !this.isHidden;
}
