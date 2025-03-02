import { Component, EventEmitter, Input, OnInit, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';

@Component({ template: '' })
export abstract class BaseInput {
    @Output() valueChange = new EventEmitter<string>();
    @Output() blur: EventEmitter<void> = new EventEmitter<void>();
    @Input() placeholder: string = '';
    @Input() disabled: boolean = false;
    abstract onChange: (value: any) => void;
    abstract onTouched: () => void;
}