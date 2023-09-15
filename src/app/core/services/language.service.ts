import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  lang = ['ru', 'uz', 'en'];

  defaultLang: string = 'ru';

  langSubject = new Subject<any>();

  constructor(private translate: TranslateService) {
  }

  installLangOnBoot(): void {
    this.translate.addLangs(this.lang);
    this.translate.setDefaultLang(this.defaultLang);

    let checkedLang: string = this.defaultLang;
    let langInLocalStorage: string | null = localStorage.getItem('language');

    if (langInLocalStorage && this.checkIfLangIsAvailable(langInLocalStorage)) {
      checkedLang = langInLocalStorage;
    } else {
      localStorage.setItem('language', this.defaultLang);
    }

    this.translate.use(checkedLang);
  }

  selectLang(value: string): void {
    if (this.checkIfLangIsAvailable(value)) {
      this.translate.use(value);
      localStorage.removeItem('language');
      localStorage.setItem('language', value);

      this.langSubject.next({ lang: value });
    } else {
      console.warn('[LANGUAGE]: Выбор языка не выполнен.');
    }
  }

  listenerLang(): Observable<any> {
    return this.langSubject.asObservable();
  }

  getLang(): string {
    let language = localStorage.getItem('language');

    if (language) {
      return language;
    }

    return this.defaultLang;
  }

  checkIfLangIsAvailable(value: string): boolean {
    if (this.lang.indexOf(value) == -1) {
      console.warn('[LANGUAGE]: Значение (' + value + ') отсутствует в наборе допустимых языков.');
      return false;
    }

    return true;
  }
}
