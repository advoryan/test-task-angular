import { Injectable } from '@angular/core';
import { DateService } from '../../../shared/services/date.service';
import { CountriesAutocompleteService } from './countries-autocomplete.service';
import { FormFieldConfig, UserFormFields, UserFormFieldsLabels, UserFormFieldsTypes } from '../interfaces/forms';

@Injectable({
  providedIn: 'root'
})
export class FormFieldFactoryService {
  private fieldConfigs: Record<UserFormFields, FormFieldConfig>;

  constructor(
    private dateService: DateService,
    private countriesAutocompleteService: CountriesAutocompleteService
  ) {
    this.fieldConfigs = {
      [UserFormFields.Country]: {
        label: UserFormFieldsLabels.Country,
        type: UserFormFieldsTypes.Text,
        controlName: UserFormFields.Country,
        search: this.countriesAutocompleteService.search,
      },
      [UserFormFields.Username]: {
        label: UserFormFieldsLabels.Username,
        type: UserFormFieldsTypes.Text,
        controlName: UserFormFields.Username,
      },
      [UserFormFields.Birthday]: {
        label: UserFormFieldsLabels.Birthday,
        type: UserFormFieldsTypes.Date,
        controlName: UserFormFields.Birthday,
        max: this.dateService.getCurrentDate(),
      },
    };
  }
  
  public createFormFieldConfig(controlName: UserFormFields): FormFieldConfig {
    const config = this.fieldConfigs[controlName];
    if (!config) {
      throw new Error(`Unknown control name: ${controlName}`);
    }
    return config;
  }
}
