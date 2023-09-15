import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LanguageService } from '../../../../core/services/language.service';
import { LANGUAGE } from '../../../../core/constants';
import { CoreUsersService } from '../../../../core/services/core-users.service';
import { ERROR_MESSAGES, VALIDATION_ERROR_MESSAGES } from '../../../../core/tokens/validation-error-message.token';
import { DestroyService } from '../../../../core/services/destroy.service';
import { takeUntil } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

const TRANSLATES = {
  ...ERROR_MESSAGES,
  incorrectUsername: () => (
    {
      ru: 'Пользователя с таким логином не существует',
      uz: 'Bu login bilan foydalanuvchi yo\'q',
      en: 'There is no user with this login',
    }
  ),
  incorrectPassword: () => (
    {
      ru: 'Неверно указан пароль',
      uz: 'Noto\'g\'ri parol',
      en: 'Incorrect password',
    }
  ),
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    DestroyService,
    {
      provide: VALIDATION_ERROR_MESSAGES,
      useFactory: () => TRANSLATES,
    },
  ],
})
export class LoginComponent {
  language: string = this.languageService.getLang();

  languages = LANGUAGE;

  form: FormGroup = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required],
  });

  sendForm: boolean = false;

  private readonly notifier: NotifierService;

  constructor(
    @Inject(DestroyService) private readonly destroy$: DestroyService,
    private readonly languageService: LanguageService,
    private readonly fb: FormBuilder,
    private readonly coreUsersService: CoreUsersService,
    private readonly notifierService: NotifierService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
  ) {
    this.notifier = notifierService;
  }

  selectLanguage(value: string) {
    this.languageService.selectLang(value);
  }

  submit() {
    this.sendForm = true;
    this.coreUsersService.login(this.form.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.notifier.notify('success', this.translateService.instant('AUTH.LOGIN.SUCCESS', { username: response.wp_user.data.display_name }));
      this.router.navigate(['/']);
      this.sendForm = false;
    }, (err) => {
      if (err.error.code == 'invalid_username') {
        this.form.get('username')?.setErrors({ 'incorrectUsername': true });
      } else if (err.error.code == 'incorrect_password') {
        this.form.get('password')?.setErrors({ 'incorrectPassword': true });
      } else {
        this.notifier.notify('error', this.translateService.instant('AUTH.LOGIN.ERROR'));
      }

      this.sendForm = false;
    });
  }
}
