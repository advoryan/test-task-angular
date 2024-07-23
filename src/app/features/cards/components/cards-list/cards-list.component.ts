import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CardComponent } from '../card/card.component';
import {
  UserForm,
  UserFormGroup,
} from '../../interfaces/forms';
import { FormCreateBtnComponent } from '../card-create-btn/card-create-btn.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  tap,
} from 'rxjs';
import { FormHandlerService } from '../../services/form-handler.service';
import { SubmissionService } from '../../services/submission.service';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../../../../shared/pipes/time-format.pipe';
import { FORM_CARD_LIMIT, SUBMIT_TIMER_SEC } from '../../constants/form.constants';

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    FormCreateBtnComponent,
    TimeFormatPipe,
  ],
  templateUrl: './cards-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsListComponent implements OnInit {
  public hasCardLimitReached = signal<boolean>(false);
  public invalidCardsCount = signal<number>(0);
  public isSubmitting = signal<boolean>(false);
  public form!: FormGroup<UserFormGroup>;
  
  private destroyRef = inject(DestroyRef);
  private formHandlerService = inject(FormHandlerService);
  private submissionService = inject(SubmissionService);
  
  public countdown = this.submissionService.countdown;

  get cards(): FormArray<FormGroup<UserForm>> {
    return this.formHandlerService.getCardsArray(this.form);
  }

  ngOnInit(): void {
    this.form = this.formHandlerService.createFormGroup();
    this.addCard();

    this.formHandlerService.getCardsArray(this.form).valueChanges.pipe(
      tap(() => this.updateCardStates()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.formHandlerService.getCardsArray(this.form).statusChanges.pipe(
      tap(() => this.updateInvalidCardsCount()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  public isOverCardLimit(length: number): void {
    this.hasCardLimitReached.set(length >= FORM_CARD_LIMIT);
  }

  public addCard(): void {
    if (this.hasCardLimitReached()) {
      return;
    }
    this.formHandlerService.addCard(this.form);
  }

  public removeCard(index: number): void {
    this.formHandlerService.removeCard(this.form, index);
  }

  public submit(timer: number = SUBMIT_TIMER_SEC): void {
    if (this.form.valid) {
      this.isSubmitting.set(true);
      this.submissionService.startSubmission(
        this.form,
        timer,
        this.onComplete.bind(this)
      ).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();
    }
  }

  public cancelSubmit(): void {
    this.submissionService.cancelSubmission();
    this.isSubmitting.set(false);
  }

  private updateCardStates(): void {
    const cardsArray = this.formHandlerService.getCardsArray(this.form);
    this.isOverCardLimit(cardsArray.length);
  }

  private updateInvalidCardsCount(): void {
    const cardsArray = this.formHandlerService.getCardsArray(this.form);
    this.invalidCardsCount.set(
      this.formHandlerService.getInvalidCardsCount(cardsArray)
    );
  }

  private onComplete(): void {
    this.form.reset();
    this.formHandlerService.getCardsArray(this.form).clear();
    this.isSubmitting.set(false);
  }
}
