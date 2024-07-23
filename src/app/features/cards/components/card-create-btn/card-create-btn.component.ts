import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-form-create-btn',
  standalone: true,
  imports: [],
  templateUrl: './card-create-btn.component.html',
  styleUrl: './card-create-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCreateBtnComponent {
  @Output() public onClick = new EventEmitter<void>();

  public handleClick() {
    this.onClick.emit();
  }
}
