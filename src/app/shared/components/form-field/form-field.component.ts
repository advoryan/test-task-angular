import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl,ReactiveFormsModule, FormsModule, ControlValueAccessor, NgControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { OperatorFunction } from 'rxjs';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule, NgbTypeaheadModule],
  templateUrl: './form-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true,
    },
    { 
      provide: NgControl, 
      useExisting: forwardRef(() => FormFieldComponent)
    },
  ],
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() control!: FormControl;
  @Input() search: OperatorFunction<string, readonly string[]> | null = null;
  @Input() public validationClass: string = '';
  @Input() public max: string = '';

  
  writeValue(value: any): void {}
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  onChange = (value: any) => {};
  onTouched = () => {};
}
