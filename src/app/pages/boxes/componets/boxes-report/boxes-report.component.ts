import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoxesEnum } from '../../enum/boxes.enum';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../core/services/language.service';
import { ModalService } from '../../../../core/services/modal.service';
import { noSpaceValidators } from '../../../../core/validators/no-space.validators';
import { BoxesCategory, RequestReport, ResponseReport } from '../../interfaces/boxes';
import { BoxesService } from '../../services/boxes.service';
import { DatetimeService } from '../../../../core/services/datetime.service';
import { BoxesStateService } from '../../services/boxes-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-boxes-report',
  templateUrl: './boxes-report.component.html',
  styleUrls: ['./boxes-report.component.scss'],
})
export class BoxesReportComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  brand: BoxesCategory[] = [];

  group: BoxesCategory[] = [];

  form: FormGroup = this.fb.group({
    objectReport: [null, [Validators.required]],
    boxNumber: [null, noSpaceValidators('brand')],
    brand: [null],
    group: [null],
    dateFrom: [null, Validators.required],
    dateTo: [null, Validators.required],
  });

  objectReport = [
    { id: BoxesEnum.ALL, name: { ru: 'Все боксы', en: 'All boxes', uz: 'Barcha qutilar' } },
    { id: BoxesEnum.BOX_NUMBER, name: { ru: 'Номер бокса', en: 'Box number', uz: 'Quti raqami' } },
    { id: BoxesEnum.BRAND, name: { ru: 'Бренд', en: 'Brand', uz: 'Brend' } },
    { id: BoxesEnum.GROUP, name: { ru: 'Группа', en: 'Group', uz: 'Guruh' } },
  ];

  lang: string = this.languageServices.getLang();

  sendForm: boolean = false;

  result: ResponseReport = {
    rub: 0,
    sum: 0,
    dollar: 0,
    euro: 0,
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly translateService: TranslateService,
    private readonly languageServices: LanguageService,
    private readonly boxesService: BoxesService,
    private readonly dateTimeService: DatetimeService,
    protected readonly modalService: ModalService,
    private readonly boxesStateService: BoxesStateService,
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.languageServices.listenerLang().subscribe((val) => {
        this.lang = val.lang;
      }),
    );

    this.form.get('objectReport')?.patchValue(0);

    this.getCategory();
  }

  getCategory() {
    this.subscriptions.add(
      this.boxesStateService.category$.subscribe((response) => {
        this.brand = response.brand;
        this.group = response.group;
      }),
    );
  }

  changeObject($event: any) {
    this.form.get('boxNumber')?.setValue(null);
    this.form.get('brand')?.setValue(null);
    this.form.get('group')?.setValue(null);

    if ($event.id === 0) {
      this.form.get('boxNumber')?.removeValidators(Validators.required);
      this.form.get('brand')?.removeValidators(Validators.required);
      this.form.get('group')?.removeValidators(Validators.required);
    }
    if ($event.id === 1) {
      this.form.get('boxNumber')?.addValidators(Validators.required);
      this.form.get('brand')?.removeValidators(Validators.required);
      this.form.get('group')?.removeValidators(Validators.required);
    }
    if ($event.id === 2) {
      this.form.get('boxNumber')?.removeValidators(Validators.required);
      this.form.get('group')?.removeValidators(Validators.required);
      this.form.get('brand')?.addValidators(Validators.required);
    }
    if ($event.id === 3) {
      this.form.get('boxNumber')?.removeValidators(Validators.required);
      this.form.get('brand')?.removeValidators(Validators.required);
      this.form.get('group')?.addValidators(Validators.required);
    }
    this.form.get('boxNumber')?.updateValueAndValidity();
    this.form.get('brand')?.updateValueAndValidity();
    this.form.get('group')?.updateValueAndValidity();
  }

  submit() {
    this.sendForm = true;
    this.result = {
      rub: 0,
      sum: 0,
      dollar: 0,
      euro: 0,
    };

    delete this.form.value.dateFrom;
    delete this.form.value.dateTo;

    const data: RequestReport = {
      dateFrom: this.dateTimeService.convertDate(this.form.get('dateFrom')?.value),
      dateTo: this.dateTimeService.convertDate(this.form.get('dateTo')?.value),
      ...this.form.value,
    };

    this.subscriptions.add(
      this.boxesService.reports(data).subscribe((response) => {
        this.sendForm = false;
        this.result = response;
      }),
    );
  }

  numberWithCommas(amount: number | undefined) {
    if (amount) {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    } else {
      return 0;
    }
  }

  close() {
    this.modalService.close();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
