import { Component, OnInit } from '@angular/core';
import { DonateCategory, DonateReport, DonateReportRequest } from '../../interfaces/donate';
import { ERROR_MESSAGES, VALIDATION_ERROR_MESSAGES } from '../../../../core/tokens/validation-error-message.token';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatetimeService } from '../../../../core/services/datetime.service';
import { DonateService } from '../../services/donate.service';
import { ModalService } from '../../../../core/services/modal.service';
import { noSpaceValidators } from '../../../../core/validators/no-space.validators';
import { LatinLettersOnlyValidator } from '../../../../core/validators/latin-letters-only.validators';
import { Subscription } from 'rxjs';
import { DonateStateService } from '../../services/donate-state.service';
import { DonateEnum } from '../../enum/donate.enum';
import { LanguageService } from '../../../../core/services/language.service';
import { Language } from '../../../../core/interfaces/language';

const TRANSLATES = {
  ...ERROR_MESSAGES,
};

@Component({
  selector: 'app-donate-report',
  templateUrl: './donate-report.component.html',
  styleUrls: ['./donate-report.component.scss'],
  providers: [
    {
      provide: VALIDATION_ERROR_MESSAGES,
      useFactory: () => TRANSLATES,
    },
  ],
})
export class DonateReportComponent implements OnInit {
  subscriptions: Subscription = new Subscription();

  system: DonateCategory[] = [];

  result: DonateReport[] = [];

  form: FormGroup = this.fb.group({
    objectReport: [null, [Validators.required]],
    id: [null, [noSpaceValidators('id'), LatinLettersOnlyValidator('id')]],
    systems: [null, Validators.required],
    dateFrom: [null, Validators.required],
    dateTo: [null, Validators.required],
  });

  sendForm: boolean = false;

  objectReport = [
    { id: DonateEnum.ALL, name: { ru: 'Все ID', en: 'All IDs', uz: 'Barcha identifikatorlar' } },
    { id: DonateEnum.WARD_ID, name: { ru: 'ID подопечного', en: 'Ward ID', uz: 'Bo\'lim identifikatori' } },
  ];

  lang: string = this.languageServices.getLang();

  constructor(
    private readonly fb: FormBuilder,
    private readonly dateTimeService: DatetimeService,
    private readonly donateService: DonateService,
    private readonly donateStateService: DonateStateService,
    protected readonly modalService: ModalService,
    private readonly languageServices: LanguageService,
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.languageServices.listenerLang().subscribe((val) => {
        this.lang = val.lang;
      }),
    );

    this.getCategory();

    this.form.get('objectReport')?.setValue(0);
  }

  getCategory() {
    this.subscriptions.add(
      this.donateStateService.donateCategory$.subscribe((response) => {
        this.system = response;
      }),
    );
  }

  changePercent(value: any, i: number) {
    this.result[i].result = this.result[i].amount - (this.result[i].amount / 100 * value);
  }

  changeObject(object: { id: number, name: Language }) {
    this.form.get('id')?.setValue(null);

    if (object.id === 1) {
      this.form.get('id')?.addValidators(Validators.required);
    } else {
      this.form.get('id')?.removeValidators(Validators.required);
    }

    this.form.get('id')?.updateValueAndValidity();
  }

  numberWithCommas(amount: number | undefined) {
    if (amount) {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    } else {
      return 0;
    }
  }

  submit() {
    this.sendForm = true;
    this.result = [];

    delete this.form.value.dateFrom;
    delete this.form.value.dateTo;

    const data: DonateReportRequest = {
      dateFrom: this.dateTimeService.convertDate(this.form.get('dateFrom')?.value),
      dateTo: this.dateTimeService.convertDate(this.form.get('dateTo')?.value),
      ...this.form.value,
    };

    this.subscriptions.add(
      this.donateService.reports(data).subscribe((response) => {
        this.result = response;
        this.result.forEach((item, index) => {
          this.changePercent(item.percent, index);
        });
        this.sendForm = false;
      }),
    );
  }

  close() {
    this.modalService.close();
  }
}
