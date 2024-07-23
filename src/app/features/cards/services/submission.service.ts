import { inject, Injectable, signal } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import {
  Subject,
  interval,
  takeUntil,
  tap,
  filter,
  take,
  map,
  finalize,
  Observable,
  catchError,
  EMPTY,
  switchMap,
} from 'rxjs';
import {
  UserForm,
  UserFormGroup,
  UserFormGroupFields,
} from '../interfaces/forms';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { SubmitFormResponseData } from '../../../shared/interface/responses';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  public countdown = signal<number>(0);
  private cancelSubmit$ = new Subject<void>();
  private http = inject(HttpClient);

  public startSubmission(
    form: FormGroup<UserFormGroup>,
    initialCountdown: number,
    onComplete: () => void
  ): Observable<HttpResponse<SubmitFormResponseData>> {
    this.toggleAllControls(form);
    const cards = form.controls[UserFormGroupFields.Cards].value as string[];
    this.countdown.set(initialCountdown);

    return interval(1000).pipe(
      takeUntil(this.cancelSubmit$),
      map((count: number) => ++count),
      tap((count: number) => this.countdown.set(initialCountdown - count)),
      filter((count: number) => count === initialCountdown),
      tap(onComplete),
      switchMap(() => this.submitForm(cards)),
      take(1),
      finalize(() => this.resetFormSubmission(form, initialCountdown))
    );
  }

  public cancelSubmission(): void {
    this.cancelSubmit$.next();
  }

  public submitForm(
    forms: string[]
  ): Observable<HttpResponse<SubmitFormResponseData>> {
    return this.http.post<any>('/api/submitForm', { forms }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return EMPTY;
      })
    );
  }

  private resetFormSubmission(
    form: FormGroup<UserFormGroup>,
    initialCountdown: number
  ): void {
    this.countdown.set(initialCountdown);
    this.toggleAllControls(form);
  }

  private toggleAllControls(form: FormGroup<UserFormGroup>): void {
    const cards = form.controls[UserFormGroupFields.Cards] as FormArray<
      FormGroup<UserForm>
    >;
    cards.controls.forEach((control) =>
      control.enabled ? control.disable() : control.enable()
    );
  }
}
