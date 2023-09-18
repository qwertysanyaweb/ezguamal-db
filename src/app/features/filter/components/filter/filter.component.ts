import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterDataTypesEnum } from '../../enums/filter-data-types.enum';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from '../../../../core/services/destroy.service';
import { FilterSettings } from '../../interfaces/filter-settings';
import { FilterStateService } from '../../states/filter-state.service';
import { ModalService } from '../../../../core/services/modal.service';

const SAVE = 'save';
const SAVED_DATA = 'savedData';
const DATE = 'date';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class FilterComponent implements OnInit {
  readonly filterDataTypesEnum = FilterDataTypesEnum;

  form!: FormGroup;

  formList: any = [];

  filterSettings?: FilterSettings;

  save: boolean = true;

  loading: boolean = true;

  maxDate: Date;

  constructor(
    @Inject(DestroyService) private readonly destroy$: DestroyService,
    private readonly filterStateService: FilterStateService,
    private readonly cdr: ChangeDetectorRef,
    protected readonly modalService: ModalService,
  ) {
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
  }

  ngOnInit(): void {
    this.loadSpinner();
    this.loadData();
  }

  loadSpinner(): void {
    this.filterStateService.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
      this.cdr.markForCheck();
    });
  }

  loadData(): void {
    this.filterStateService.filterData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((filterSettings) => {
        this.formList = [];
        this.filterStateService.setLoading(false);
        this.filterSettings = { ...filterSettings };

        this.initForm(filterSettings);

        if (filterSettings.hasOwnProperty(SAVE) && filterSettings.hasOwnProperty(SAVED_DATA)) {
          if (filterSettings.save) {
            for (const prop of Object.keys(filterSettings.savedData)) {
              if (prop.includes(DATE)) {
                if (this.filterSettings.savedData[prop].dateFrom) {
                  this.filterSettings.savedData[prop].dateFrom = new Date(
                    this.filterSettings.savedData[prop].dateFrom,
                  );
                }
                if (this.filterSettings.savedData[prop].dateTo) {
                  this.filterSettings.savedData[prop].dateTo = new Date(
                    this.filterSettings.savedData[prop].dateTo,
                  );
                }
              }

              this.form.get(prop)?.patchValue(this.filterSettings.savedData[prop]);
            }
          }
        }
      });
  }

  initForm(filterData: FilterSettings): void {
    let formDataObj: any = {};
    for (const prop of Object.keys(filterData.data)) {
      if (this.filterDataTypesEnum.DATE === filterData.data[prop].type) {
        formDataObj[prop] = new FormControl();
      } else if (
        this.filterDataTypesEnum.SELECT === filterData.data[prop].type ||
        this.filterDataTypesEnum.MULTI_SELECT === filterData.data[prop].type
      ) {
        const collator = new Intl.Collator('ru');
        const sort = filterData.data[prop].data.sort((a: any, b: any) =>
          collator.compare(a.name, b.name),
        );
        formDataObj[prop] = new FormControl(sort);
      } else {
        formDataObj[prop] = new FormControl(filterData.data[prop].data);
      }
      this.form = new FormGroup(formDataObj);
      if (this.filterDataTypesEnum.INPUT === filterData.data[prop].type) {
        this.form.get([prop])?.setValue(null);
      }
      if (this.filterDataTypesEnum.RADIO === filterData.data[prop].type) {
        this.form.get([prop])?.setValue(null);
      }
      if (this.filterDataTypesEnum.SELECT === filterData.data[prop].type) {
        this.form.get([prop])?.setValue(null);
      }
      if (this.filterDataTypesEnum.MULTI_SELECT === filterData.data[prop].type) {
        this.form.get([prop])?.setValue([]);
      }
      this.formList.push({
        ...filterData.data[prop],
        key: prop,
      });
    }
  }

  remove(control: string): void {
    const a = this.form.get(control)?.value;
    if (!a.length) {
      this.form.get(control)?.reset();
    }
  }

  reset(): void {
    this.form.reset();
    this.applyFilter();
    this.close();
  }

  close(): void {
    this.modalService.close();
  }

  applyFilter(): void {
    this.filterStateService.setFilterParams(this.form.value);
    this.close();
  }
}
