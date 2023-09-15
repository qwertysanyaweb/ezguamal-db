import { Inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { VALIDATION_ERROR_MESSAGES } from '../../../core/tokens/validation-error-message.token';
import { LanguageService } from '../../../core/services/language.service';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from '../../../core/services/destroy.service';

@Pipe({
  name: 'dynamicInputErrorMessage',
})
export class DynamicInputErrorMessagesPipe implements PipeTransform, OnInit {

  language: string = this.languageService.getLang();

  constructor(
    @Inject(DestroyService) private readonly destroy$: DestroyService,
    @Inject(VALIDATION_ERROR_MESSAGES) private readonly errorMessages: ValidationErrors,
    private readonly languageService: LanguageService,
  ) {
  }

  ngOnInit() {
    this.languageService.listenerLang().pipe(takeUntil(this.destroy$)).subscribe((language) => {
      this.language = language;
    });
  }

  transform(key: string, errValue: any): string {
    if (!this.errorMessages[key]) {
      console.warn(`Не указано сообщение ошибки для ${key}`);
      return '';
    }
    return this.errorMessages[key](errValue)[this.language];
  }

}
