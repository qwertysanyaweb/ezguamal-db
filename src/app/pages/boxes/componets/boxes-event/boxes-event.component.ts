import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoxesService } from '../../services/boxes.service';
import { NotifierService } from 'angular-notifier';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Box, BoxesCategory, BoxesCategoryResponse } from '../../interfaces/boxes';
import { ERROR_MESSAGES, VALIDATION_ERROR_MESSAGES } from '../../../../core/tokens/validation-error-message.token';
import { noSpaceValidators } from '../../../../core/validators/no-space.validators';
import { ModalService } from '../../../../core/services/modal.service';
import { BoxesStateService } from '../../services/boxes-state.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

const TRANSLATES = {
  ...ERROR_MESSAGES,
};

@Component({
  selector: 'app-boxes-event',
  templateUrl: './boxes-event.component.html',
  styleUrls: ['./boxes-event.component.scss'],
  providers: [ModalService, {
    provide: VALIDATION_ERROR_MESSAGES,
    useFactory: () => TRANSLATES,
  }],
})
export class BoxesEventComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  loadingData: boolean = true;

  event: string = <string>this.currentRoute.snapshot.paramMap.get('event');

  boxId: number = Number(this.currentRoute.snapshot.paramMap.get('id'));

  eventType = {
    add: 'add',
    edit: 'edit',
  };

  dataBox: Box = {
    id: 0,
    box_number: '',
    box_address: '',
    box_phone: '',
    box_dataCreate: '',
    box_dataClose: '',
    region: [],
    brand: [],
    post_status: '',
    box_open: [],
    title: '',
    box_coordinates: '',
    group: [],
  };

  sendForm: boolean = false;

  category: BoxesCategoryResponse = {
    brand: [],
    region: [],
    group: [],
  };

  form: FormGroup = this.fb.group({
    date: [null, Validators.required],
    title: [null, Validators.required],
    box_number: [null, [Validators.required, noSpaceValidators('brand')]],
    brand: [null, Validators.required],
    group: [null, Validators.required],
    region: [null, Validators.required],
    box_coordinates: [null, Validators.required],
    box_phone: [null, Validators.required],
    box_address: [null, Validators.required],
  });

  loadCategory: boolean = false;

  maxDate = new Date();

  changeStateLoad: boolean = false;

  constructor(
    private currentRoute: ActivatedRoute,
    private readonly boxesService: BoxesService,
    private readonly boxesStateService: BoxesStateService,
    private readonly notifierService: NotifierService,
    private readonly location: Location,
    private readonly fb: FormBuilder,
    protected readonly modalService: ModalService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
  ) {
  }

  back() {
    this.location.back();
  }

  ngOnInit(): void {
    if (this.event === this.eventType.add) {
      this.loadingData = false;
    } else {
      this.getBox();
    }

    this.getCategory();
  }

  getCategory() {
    this.subscriptions.add(
      this.boxesStateService.category$.subscribe((response) => {
        this.loadCategory = false;
        this.category = response;
      }),
    );
  }

  getBox() {
    this.boxesService.getList({ p: this.boxId }).subscribe((response) => {
      this.loadingData = false;
      this.dataBox = response.post[0];
      this.setForm(response.post[0]);
    }, (err) => {
      this.router.navigate(['/boxes']);
      this.notifierService.notify('error', this.translateService.instant('ERROR.00001'));
    });
  }

  setForm(data: Box) {
    const date = this.form.get('date');
    const title = this.form.get('title');
    const box_number = this.form.get('box_number');
    const brand = this.form.get('brand');
    const group = this.form.get('group');
    const region = this.form.get('region');
    const coordinates = this.form.get('box_coordinates');
    const phone = this.form.get('box_phone');
    const address = this.form.get('box_address');

    date?.setValue(data.box_dataCreate);
    date?.disable();

    box_number?.setValue(data.box_number);
    box_number?.disable();

    title?.setValue(data.title);

    brand?.patchValue(data.brand[0].id);
    brand?.disable();

    group?.patchValue(data.group[0].id);
    group?.disable();

    region?.patchValue(data.region.map(region => region.id));

    coordinates?.setValue(data.box_coordinates);
    phone?.setValue(data.box_phone);
    address?.setValue(data.box_address);
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  changeBrand(value: BoxesCategory) {
    this.form.get('box_phone')?.setValue(value.description);
  }

  submit() {
    if (this.boxId) {
      this.editBox();
    } else {
      this.addBox();
    }
  }

  addBox() {
    this.sendForm = true;
    this.subscriptions.add(
      this.boxesService.addBox(this.form.value).subscribe(() => {
        this.sendForm = false;
        this.router.navigate(['/boxes']);
        this.notifierService.notify('success', this.translateService.instant('BOXES.SUCCESS.ADD_BOX', {
          title: this.form.get('title')?.value,
          number: this.form.get('box_number')?.value,
        }));
      }, (err) => {
        this.notifierService.notify('error', this.translateService.instant('ERROR.' + err.error.code));
        this.sendForm = false;
      }),
    );
  }

  editBox() {
    this.sendForm = true;
    this.subscriptions.add(
      this.boxesService.editBox(this.form.value, this.boxId).subscribe(() => {
        this.sendForm = false;
        this.notifierService.notify('success', this.translateService.instant('BOXES.SUCCESS.SAVE', {
          title: this.form.get('title')?.value,
          number: this.form.get('box_number')?.value,
        }));
      }, (err) => {
        this.notifierService.notify('error', this.translateService.instant('ERROR.' + err.error.code));
        this.sendForm = false;
      }),
    );
  }

  changeState(id: number, state: string) {
    this.changeStateLoad = true;
    this.subscriptions.add(
      this.boxesService.changeState({ id, state }).subscribe((response) => {
        this.changeStateLoad = false;
        if (response) {
          this.getBox();
          this.notifierService.notify('success', this.translateService.instant('BOXES.SUCCESS.CHANGE_STATE'));
        } else {
          this.notifierService.notify('error', this.translateService.instant('BOXES.ERROR.CHANGE_STATE'));
        }
      }, (err) => {
        this.changeStateLoad = false;
        this.notifierService.notify('error', this.translateService.instant('ERROR.' + err.error.code));
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
