import { inject, Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { Country } from '../../../shared/enum/country';
import {
  UserFormGroup,
  UserForm,
  UserFormFields,
  UserFormGroupFields,
} from '../interfaces/forms';
import { CountryValidator } from '../validators/country.validator';
import { UsernameValidator } from '../../../shared/validators/username-async.validator';
import { BirthdayValidator } from '../validators/birthday.validator';

@Injectable({
  providedIn: 'root',
})
export class FormHandlerService {
  private fb = inject(FormBuilder);
  private usernameValidator = inject(UsernameValidator);

  public createFormGroup(): FormGroup<UserFormGroup> {
    return this.fb.group<UserFormGroup>({
      cards: this.fb.array<FormGroup<UserForm>>([]),
    });
  }

  public getCardsArray (form: FormGroup<UserFormGroup>): FormArray<FormGroup<UserForm>> {
    return form.controls[UserFormGroupFields.Cards] as FormArray<FormGroup<UserForm>>;
  }

  public addCard(form: FormGroup<UserFormGroup>) {
    const cards = this.getCardsArray(form);
    cards.push(this.createCardFormGroup());
  }

  public removeCard(form: FormGroup<UserFormGroup>, index: number) {
    const cards = this.getCardsArray(form);
    cards.removeAt(index);
  }

  public getInvalidCardsCount(cards: FormArray<FormGroup<UserForm>>): number {
    return cards.controls.filter((card) => card.invalid && card.dirty).length;
  }

  private createCardFormGroup(): FormGroup<UserForm> {
    return this.fb.group<UserForm>({
      [UserFormFields.Country]: new FormControl(null, [
        Validators.required,
        CountryValidator(Country),
      ]),
      [UserFormFields.Username]: new FormControl(
        null,
        [Validators.required],
        [this.usernameValidator.validate()]
      ),
      [UserFormFields.Birthday]: new FormControl(null, [
        Validators.required,
        BirthdayValidator()
      ]),
    });
  }
}
