import { Component, EventEmitter, forwardRef, Input, OnInit, Output, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { BaseInput } from '../base-input';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css']
})
export class FormInputComponent extends BaseInput implements OnInit,ControlValueAccessor  {
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(@Self() public controlDir: NgControl) {
    super();
    controlDir.valueAccessor = this;
  }
  value: string = "";

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control?.validator
      ? [control.validator, Validators.required]
      : Validators.required;
    control?.setValidators(validators);
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(onChange: (value: any) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
