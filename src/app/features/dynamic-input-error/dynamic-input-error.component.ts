import { Component, HostBinding, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { KeyValue } from '@angular/common';


@Component({
  selector: 'app-dynamic-input-error',
  template: `
    <ng-container *ngIf='errors'>
      <ng-container *ngFor='let error of errors | keyvalue; trackBy:trackByFn'>
        {{ error.key | dynamicInputErrorMessage :error.value }}
      </ng-container>
    </ng-container>
  `,
})
export class DynamicInputErrorComponent {

  @HostBinding('class') hostClass = 'formGroup__error';

  @Input()
  errors: ValidationErrors | undefined | null = null;

  trackByFn(index: number, item: KeyValue<string, any>) {
    return item.key;
  }


}
