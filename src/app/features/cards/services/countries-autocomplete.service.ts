import { Injectable } from '@angular/core';
import {
  OperatorFunction,
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs';
import { Country } from '../../../shared/enum/country';

@Injectable({
  providedIn: 'root',
})
export class CountriesAutocompleteService {
  private countries = Object.values(Country);

  public search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    map((term) => term.length < 1
      ? []
      : this.countries
          .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .slice(0, 10)
    )
  );
}
