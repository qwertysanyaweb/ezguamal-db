import { AbstractControl, ValidatorFn } from '@angular/forms';


// принимает имя контрола в качестве параметра
export function customRequiredValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const value = control.value;
    if (!value || value.trim().length === 0) {
      return { [`${controlName}IsRequired`]: true };
    }
    return null;
  };
}



