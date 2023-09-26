import { Component, OnDestroy, OnInit } from '@angular/core';
import { ERROR_MESSAGES, VALIDATION_ERROR_MESSAGES } from '../../../../core/tokens/validation-error-message.token';
import { DonateCategory } from '../../interfaces/donate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatetimeService } from '../../../../core/services/datetime.service';
import { DonateService } from '../../services/donate.service';
import { ModalService } from '../../../../core/services/modal.service';
import { noSpaceValidators } from '../../../../core/validators/no-space.validators';
import { LatinLettersOnlyValidator } from '../../../../core/validators/latin-letters-only.validators';
import { numberOnlyValidators } from '../../../../core/validators/number-only.validators';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { DonateStateService } from '../../services/donate-state.service';
import { Subscription } from 'rxjs';

const TRANSLATES = {
  ...ERROR_MESSAGES,
};


@Component({
  selector: 'app-donate-add',
  templateUrl: './donate-add.component.html',
  styleUrls: ['./donate-add.component.scss'],
  providers: [
    {
      provide: VALIDATION_ERROR_MESSAGES,
      useFactory: () => TRANSLATES,
    },
  ],
})
export class DonateAddComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  system: DonateCategory[] = [];

  form: FormGroup = this.fb.group({
    title: [null, [Validators.required, noSpaceValidators('id'), LatinLettersOnlyValidator('id')]],
    name: [null, Validators.required],
    amount: [null, [Validators.required, numberOnlyValidators('amount')]],
    system: [null, Validators.required],
    date: [null],
  });

  sendForm: boolean = false;

  maxDate = new Date();
  currency = ['Сум', '$'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dateTimeService: DatetimeService,
    private readonly donateService: DonateService,
    private readonly donateStateService: DonateStateService,
    protected readonly modalService: ModalService,
    private readonly translateService: TranslateService,
    private readonly notifierService: NotifierService,
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

    delete this.form.value.date;

    this.form.value.currency = 'Сум';

    if (this.form.get('date')?.value) {
      this.form.value.date = this.dateTimeService.convertDate(this.form.get('date')?.value);
    }

    this.subscriptions.add(
      this.donateService.addDonate(this.form.value).subscribe((response) => {
        this.sendForm = false;
        if (response) {
          this.donateStateService.setChangeList(true);
          this.notifierService.notify('success', this.translateService.instant('DONATE.SUCCESS.ADD'));
          this.form.reset();
          this.close();
        } else {
          this.notifierService.notify('error', this.translateService.instant('ERROR.00004'));
        }
      }, (err) => {
        this.sendForm = false;
        this.notifierService.notify('error', this.translateService.instant('ERROR.00004'));
      }),
    );
  }

  close() {
    this.modalService.close();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
