import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../../core/services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoxesService } from '../../services/boxes.service';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { BoxesStateService } from '../../services/boxes-state.service';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-boxes-add-brand',
  templateUrl: './boxes-add-brand.component.html',
  styleUrls: ['./boxes-add-brand.component.scss'],
})
export class BoxesAddBrandComponent implements OnInit {
  subscriptions: Subscription = new Subscription();

  form: FormGroup = this.fb.group({
    brandName: [null, Validators.required],
  });

  sendForm: boolean = false;

  constructor(
    protected readonly modalService: ModalService,
    private readonly fb: FormBuilder,
    private readonly boxesService: BoxesService,
    private readonly notifierService: NotifierService,
    private readonly translateService: TranslateService,
    private readonly boxesStateService: BoxesStateService,
  ) {
  }

  ngOnInit() {
    this.subscriptions.add(
      this.boxesStateService.changeCategory$.pipe(
        switchMap((response) => {
          return this.boxesService.getCategory();
        }),
      ).subscribe((response) => {
        this.boxesStateService.setCategory(response);
      }),
    );
  }

  close(): void {
    this.modalService.close();
  }

  submit() {
    this.sendForm = true;
    const brandName = this.form.get('brandName')?.value;
    this.subscriptions.add(
      this.boxesService.addBrand(brandName).subscribe((response) => {
        this.sendForm = false;
        if (response) {
          this.notifierService.notify('success', this.translateService.instant('BOXES.SUCCESS.ADD_CATEGORY', { brandName }));
          this.boxesStateService.setChangeCategory(true);
          this.close();
          this.form.get('brandName')?.setValue('');
        } else {
          this.notifierService.notify('error', this.translateService.instant('ERROR.00003'));
        }
      }, (err) => {
        this.sendForm = false;
        this.notifierService.notify('error', this.translateService.instant('ERROR.' + err.error.code));
      }),
    );
  }
}
