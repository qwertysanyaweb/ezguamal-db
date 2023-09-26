import { AbstractControl, ValidatorFn } from '@angular/forms';

export function numberOnlyValidators(controlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const pattern = /^[0-9]+$/;
    if (value && !pattern.test(value)) {
      return { [`${controlName}LatinLettersOnly`]: true };
    }
    return null;
  };
}
