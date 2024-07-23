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
import { FormFieldConfig, UserForm, UserFormFields } from '../../interfaces/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { FormFieldFactoryService } from '../../services/form-field-factory.service';

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

  public formFields: FormFieldConfig[] = [];

  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private validationService = inject(ValidationService);
  private formFieldFactoryService = inject(FormFieldFactoryService);

  public getValidationClass(control: FormControl) {
    return this.validationService.getValidationClass(control);
  }

  ngOnInit() {
    this.initializeFormFields();
    this.viewUpdateOnChanges();
  }

  public emitRemoveCard() {
    this.removeCard.emit();
  }

  private initializeFormFields() {
    const controlNames = [
      UserFormFields.Country,
      UserFormFields.Username,
      UserFormFields.Birthday,
    ];
    this.formFields = controlNames.map((controlName) =>
      this.formFieldFactoryService.createFormFieldConfig(controlName)
    );
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
