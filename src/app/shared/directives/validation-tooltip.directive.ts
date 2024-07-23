import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { createPopper, Instance } from '@popperjs/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ValidationService } from '../services/validation.service';
import { tap } from 'rxjs';

@Directive({
  selector: '[appValidationTooltip]',
  standalone: true,
})
export class ValidationTooltipDirective implements OnInit, OnDestroy {
  private popperInstance!: Instance;
  private tooltip!: HTMLElement;
  private control!: AbstractControl;
  private elementRef = inject(ElementRef);
  private controlDir = inject(NgControl);
  private destroyRef = inject(DestroyRef);
  private validationService = inject(ValidationService);

  ngOnInit(): void {
    this.control = this.controlDir.control!;
    if (this.control) {
      this.createTooltip();
      this.handleTooltipUpdate();
    }
  }

  ngOnDestroy(): void {
    this.destroyTooltip();
  }

  private createTooltip(): void {
    this.tooltip = document.createElement('small');
    this.tooltip.className = 'block text-danger';
    this.tooltip.style.fontSize = '0.76em';
    document.body.appendChild(this.tooltip);
    this.popperInstance = createPopper(
      this.elementRef.nativeElement,
      this.tooltip,
      { placement: 'bottom-start' }
    );
  }

  private updateTooltip(): void {
    if (this.control.invalid && this.control.dirty) {
      const errors = this.control.errors ?? {};
      const errorMessages = Object.keys(errors).map((key) =>
        this.validationService.getErrorMessage(key, errors[key])
      );
      this.tooltip.innerHTML = errorMessages[0];
      this.tooltip.style.display = 'block';
    } else {
      this.tooltip.style.display = 'none';
    }
  }

  private destroyTooltip(): void {
    this.popperInstance.destroy();
    document.body.removeChild(this.tooltip);
  }

  private handleTooltipUpdate(): void {
    this.control.statusChanges.pipe(
      tap(() => this.updateTooltip()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
