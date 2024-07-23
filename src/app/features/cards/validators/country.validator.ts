import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ErrorMessages, ValidationErrKeys } from '../../../shared/interface/validator-errors';

export function CountryValidator(enumObject: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return control.value && Object.values(enumObject).includes(control.value) 
      ? null 
      : { [ValidationErrKeys.Country] : ErrorMessages[ValidationErrKeys.Country] };
  };
}