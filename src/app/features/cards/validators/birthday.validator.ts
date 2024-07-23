import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ErrorMessages, ValidationErrKeys } from '../../../shared/interface/validator-errors';

export function BirthdayValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const today = new Date();
    const birthday = new Date(control.value);

    return birthday < today 
      ? null 
      : { [ValidationErrKeys.Birthday] : ErrorMessages[ValidationErrKeys.Birthday] };
  };
}