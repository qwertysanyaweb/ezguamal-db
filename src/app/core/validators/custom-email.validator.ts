import { AbstractControl, ValidatorFn } from '@angular/forms';


// принимает имя контрола в качестве параметра
export function customEmailValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const value = control.value;
    const emailRegex = /\S+@\S+\.\S+/;
    if (value && !emailRegex.test(control.value)) {
      return { [`${controlName}InvalidEmail`]: true };
    }
    return null;
  };
}



