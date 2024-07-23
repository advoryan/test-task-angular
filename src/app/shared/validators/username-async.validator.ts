import {
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, map, catchError, of, debounceTime, switchMap } from 'rxjs';
import { UsernameService } from '../services/username.service';
import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessages, ValidationErrKeys } from '../interface/validator-errors';

@Injectable({
  providedIn: 'root',
})
export class UsernameValidator {
  private usernameService = inject(UsernameService);

  validate(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        debounceTime(300),
        switchMap((username: string) => this.usernameService.isAvailable(username).pipe(
          map((isAvailable: boolean) => isAvailable
            ? null
            : { [ValidationErrKeys.Username]: ErrorMessages[ValidationErrKeys.Username] }
          ),
          catchError((err: HttpErrorResponse) => {
            console.error(err);
            return of({
              [ValidationErrKeys.Server]: ErrorMessages[ValidationErrKeys.Server],
            });
          })
        ))
      );
    };
  }
}
