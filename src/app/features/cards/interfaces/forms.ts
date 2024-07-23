import { OperatorFunction } from "rxjs";
import { Country } from "../../../shared/enum/country";
import { FormGroup, FormArray, FormControl } from "@angular/forms";

export interface UserForm {
  [UserFormFields.Country]: FormControl<Country | null>;
  [UserFormFields.Username]: FormControl<string | null>;
  [UserFormFields.Birthday]: FormControl<string | null>;
}

export interface UserFormGroup {
  [UserFormGroupFields.Cards]: FormArray<FormGroup<UserForm>>;
}

export enum UserFormGroupFields {
  Cards = 'cards'
}

export enum UserFormFields {
  Country = 'country',
  Username = 'username',
  Birthday = 'birthday',
}

export enum UserFormFieldsLabels {
  Country = 'Country',
  Username = 'Username',
  Birthday = 'Birthday',
}

export enum UserFormFieldsTypes {
  Text = 'text',
  Date = 'date',
}

export interface FormFieldConfig {
  label: UserFormFieldsLabels;
  type: UserFormFieldsTypes;
  controlName: UserFormFields;
  search?: OperatorFunction<string, readonly string[]>;
  max?: string;
}