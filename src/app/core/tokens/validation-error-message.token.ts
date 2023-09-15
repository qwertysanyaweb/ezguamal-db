import { InjectionToken } from '@angular/core';
import { Language } from '../interfaces/language';

export const ERROR_MESSAGES: { [key: string]: (args?: any) => Language } = {
  required: () => (
    {
      ru: 'Поле обязательно для заполнения',
      uz: 'Majburiy maydon',
      en: 'Required field',
    }
  ),
};

export const VALIDATION_ERROR_MESSAGES = new InjectionToken(`Validation Messages`, {
  providedIn: 'root',
  factory: () => ERROR_MESSAGES,
});

