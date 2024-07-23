import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ErrorMessages,
  ValidationClasses,
  ValidationErrKeys,
} from '../interface/validator-errors';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private errorMessages = ErrorMessages;

  public getValidationClass(control: FormControl): string {
    return control.dirty
      ? control.invalid
        ? ValidationClasses.Invalid
        : ValidationClasses.Valid
      : '';
  }
  public getValidationClassFromBoolean(isValid: boolean): string {
    return isValid ? ValidationClasses.Valid : ValidationClasses.Invalid;
  }

  public getErrorMessage(errorKey: string, errorValue: string): string {
    if (errorKey === ValidationErrKeys.Message) {
      return errorValue || this.errorMessages[ValidationErrKeys.Invalid];
    }
    return (
      this.errorMessages[errorKey] ||
      this.errorMessages[ValidationErrKeys.Invalid]
    );
  }
}
