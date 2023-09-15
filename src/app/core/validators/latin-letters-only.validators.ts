import {AbstractControl, ValidatorFn} from "@angular/forms";

export function LatinLettersOnlyValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const value = control.value;
    const pattern = /^[a-zA-Z ]+$/;
    if (value && !pattern.test(value)) {
      return { [`${controlName}LatinLettersOnly`]: true };
    }
    return null;
  };
}
