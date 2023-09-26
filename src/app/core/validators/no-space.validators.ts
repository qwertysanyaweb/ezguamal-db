import { AbstractControl, ValidatorFn } from '@angular/forms';

export function noSpaceValidators(controlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isSpace = (control.value || '').match(/\s/g);
    return isSpace ? { 'whitespace': true } : null;
  };
}
