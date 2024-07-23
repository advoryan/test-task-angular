import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ValidationTooltipDirective } from '../../../../shared/directives/validation-tooltip.directive';
import { UserForm } from '../../interfaces/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ValidationService } from '../../../../shared/services/validation.service';
import { DateService } from '../../../../shared/services/date.service';
import { CountriesAutocompleteService } from '../../services/countries-autocomplete.service';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgbModule,
    NgbDatepickerModule,
    CommonModule,
    ValidationTooltipDirective,
    FormFieldComponent
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnInit {
  @Input({ required: true }) public cardFormGroup!: FormGroup<UserForm>;
  @Output() public removeCard = new EventEmitter<void>();

  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private countriesAutocompleteService = inject(CountriesAutocompleteService);
  private validationService = inject(ValidationService);
  private dateService = inject(DateService);

  get country() {
    return this.cardFormGroup.controls.country;
  }

  get username() {
    return this.cardFormGroup.controls.username;
  }

  get birthday() {
    return this.cardFormGroup.controls.birthday;
  }

  get today() {
    return this.dateService.getCurrentDate();
  }

  public getValidationClass(control: FormControl) {
    return this.validationService.getValidationClass(control);
  }

  ngOnInit() {
    this.viewUpdateOnChanges();
  }

  public search = this.countriesAutocompleteService.search;

  public emitRemoveCard() {
    this.removeCard.emit();
  }

  private viewUpdateOnChanges() {
    combineLatest([
      this.cardFormGroup.statusChanges,
      this.cardFormGroup.valueChanges,
    ]).pipe(
      tap(() => this.cdr.markForCheck()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
