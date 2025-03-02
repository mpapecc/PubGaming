import { Component, EventEmitter, Input, OnInit, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import { BaseInput } from '../base-input';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent extends BaseInput  {
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};
  @Input() value: string = "";
  constructor() {
    super();
  }
}
