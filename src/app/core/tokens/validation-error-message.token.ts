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
  whitespace: () => (
    {
      ru: 'Не допустимы пробелы',
      uz: 'Bo\'sh joylarga ruxsat yo\'q',
      en: 'No spaces allowed',
    }
  ),
  idLatinLettersOnly: () => (
    {
      ru: 'Разрешены буквы только латинского алфавита',
      uz: 'Faqat lotin alifbosining harflariga ruxsat beriladi',
      en: 'Only letters of the Latin alphabet are allowed',
    }
  ),

  amountLatinLettersOnly: () => (
    {
      ru: 'Разрешено вводить только цифры',
      uz: 'Faqat raqamlarga ruxsat beriladi',
      en: 'Only numbers are allowed',
    }
  ),
};

export const VALIDATION_ERROR_MESSAGES = new InjectionToken(`Validation Messages`, {
  providedIn: 'root',
  factory: () => ERROR_MESSAGES,
});

