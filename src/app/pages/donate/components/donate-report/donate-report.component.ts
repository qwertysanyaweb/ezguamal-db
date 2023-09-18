import { Component, Inject, OnInit } from '@angular/core';
import { DonateEnum } from '../../enum/donate.enum';
import { DonateReport, DonateReportRequest } from '../../interfaces/donate';
import { ERROR_MESSAGES, VALIDATION_ERROR_MESSAGES } from '../../../../core/tokens/validation-error-message.token';

import { DestroyService } from '../../../../core/services/destroy.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatetimeService } from '../../../../core/services/datetime.service';
import { DonateService } from '../../services/donate.service';
import { takeUntil } from 'rxjs/operators';
import { ModalService } from '../../../../core/services/modal.service';

const TRANSLATES = {
  ...ERROR_MESSAGES,
};

@Component({
  selector: 'app-donate-report',
  templateUrl: './donate-report.component.html',
  styleUrls: ['./donate-report.component.scss'],
  providers: [
    DestroyService,
    {
      provide: VALIDATION_ERROR_MESSAGES,
      useFactory: () => TRANSLATES,
    },
  ],
})
export class DonateReportComponent implements OnInit {

  system = [
    { id: DonateEnum.CLICK, name: DonateEnum.CLICK },
    { id: DonateEnum.PAYME, name: DonateEnum.PAYME },
    { id: DonateEnum.UZUM, name: DonateEnum.UZUM },
    { id: DonateEnum.VISA, name: DonateEnum.VISA },
  ];

  result: DonateReport[] = [];

  form: FormGroup = this.fb.group({
    id: [null, Validators.required],
    systems: [null, Validators.required],
    dateFrom: [null, Validators.required],
    dateTo: [null, Validators.required],
  });

  sendForm: boolean = false;

  DonateEnum = DonateEnum;

  constructor(
    @Inject(DestroyService) private readonly destroy$: DestroyService,
    private readonly fb: FormBuilder,
    private dateTimeService: DatetimeService,
    private donateService: DonateService,
    protected readonly modalService: ModalService,
  ) {
  }

  ngOnInit(): void {
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

    this.donateService.reports(data).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.result = response;
      this.sendForm = false;
    });
  }

  changePercent(value: any, i: number) {
    this.result[i].result = this.result[i].amount - (this.result[i].amount / 100 * value.target.value);
    console.log(this.result[i].amount / 100 * value.target.value);
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
}
