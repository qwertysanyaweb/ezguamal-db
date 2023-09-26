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
    id: [null, [Validators.required, noSpaceValidators('id'), LatinLettersOnlyValidator('id')]],
    systems: [null, Validators.required],
    dateFrom: [null, Validators.required],
    dateTo: [null, Validators.required],
  });

  sendForm: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dateTimeService: DatetimeService,
    private readonly donateService: DonateService,
    private readonly donateStateService: DonateStateService,
    protected readonly modalService: ModalService,
  ) {
  }

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory() {
    this.subscriptions.add(
      this.donateStateService.donateCategory$.subscribe((response) => {
        this.system = response;
      }),
    );
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
        this.sendForm = false;
      }),
    );
  }

  changePercent(value: any, i: number) {
    this.result[i].result = this.result[i].amount - (this.result[i].amount / 100 * value.target.value);
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
