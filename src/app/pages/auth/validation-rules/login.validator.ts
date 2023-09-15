import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class LoginValidator {
  username = [Validators.required];

  password = [Validators.required];

  errorMessages = {
    username: [
      {
        type: 'required',
        message: 'VALIDATORS.REQUIRED_FIELD',
        options: null,
      },
    ],
    password: [
      {
        type: 'required',
        message: 'VALIDATORS.REQUIRED_FIELD',
        options: null,
      },
    ],
  };
}
