import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  /**
   *
   * @param field
   * @param type
   */
  validation(field: AbstractControl, type: string): boolean {
    return field.invalid && (field.dirty || field.touched) && field.hasError(type);
  }

  /**
   *
   * @param field
   */
  checkingFieldStatus(field: AbstractControl): 'danger' | 'basic' {
    if (field.invalid && (field.dirty || field.touched)) {
      return 'danger';
    }

    return 'basic';
  }

  /**
   *
   * @param controlName
   * @param matchingControlName
   */
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      // return if another validator has already found an error on the matchingControl
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
