import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noSpaceValidators } from '../../../../core/validators/no-space.validators';
import { ModalService } from '../../../../core/services/modal.service';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { BoxesService } from '../../services/boxes.service';

@Component({
  selector: 'app-boxes-open',
  templateUrl: './boxes-open.component.html',
  styleUrls: ['./boxes-open.component.scss'],
})
export class BoxesOpenComponent {
  subscriptions: Subscription = new Subscription();

  form: FormGroup = this.fb.group({
    boxNumber: [null, noSpaceValidators('brand')],
    date: [null, Validators.required],
    sum: [null],
    dollar: [null],
    euro: [null],
    rub: [null],
  });

  sendForm: boolean = false;

  maxDate = new Date();

  constructor(
    private readonly fb: FormBuilder,
    protected readonly modalService: ModalService,
    private readonly notifierService: NotifierService,
    private readonly translateService: TranslateService,
    private boxesService: BoxesService,
  ) {
  }


  submit() {
    this.sendForm = true;
    this.subscriptions.add(
      this.boxesService.openBox(this.form.value).subscribe((response) => {
        this.sendForm = false;
        if (response) {
          this.notifierService.notify('success', this.translateService.instant('BOXES.SUCCESS.OPEN'));
          this.form.reset();
          this.close();
        } else {
          this.notifierService.notify('error', this.translateService.instant('ERROR.00004'));
        }
      }, (err) => {
        this.sendForm = false;
        this.notifierService.notify('error', this.translateService.instant('ERROR.' + err.error.code));
      }),
    );
  }


  close() {
    this.modalService.close();
  }
}
