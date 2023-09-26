import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { Donate, DonateCategory, DonatePaginationParams, RequestDonate } from '../../interfaces/donate';
import { DonateStateService } from '../../services/donate-state.service';
import { DonateService } from '../../services/donate.service';
import { ModalService } from '../../../../core/services/modal.service';
import { FilterSettings } from '../../../../features/filter/interfaces/filter-settings';
import { FilterDataTypesEnum } from '../../../../features/filter/enums/filter-data-types.enum';
import { FilterStateService } from '../../../../features/filter/states/filter-state.service';
import { DatetimeService } from '../../../../core/services/datetime.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-donate-list',
  templateUrl: './donate-list.component.html',
  styleUrls: ['./donate-list.component.scss'],
  providers: [ModalService],
})
export class DonateListComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  donates: Donate[] = [];

  donateCategory: DonateCategory[] = [];

  requestData: RequestDonate = {};

  total: number = 0;

  limit: number = 10;

  pagination: DonatePaginationParams = {
    currentPage: 1,
    posts_per_page: this.limit,
    offset: 0,
    total: 0,
  };

  loadingData: boolean = true;

  changeData: boolean = false;

  table: { name: string, value: string, sort: boolean, showSort: boolean }[] = [
    {
      name: 'DONATE.TABLE.SYSTEM',
      value: 'system',
      sort: false,
      showSort: false,
    },
    {
      name: 'DONATE.TABLE.ID',
      value: 'title',
      sort: false,
      showSort: false,
    },
    {
      name: 'DONATE.TABLE.NAME',
      value: 'name',
      sort: false,
      showSort: false,
    },
    {
      name: 'DONATE.TABLE.DATE',
      value: 'date',
      sort: false,
      showSort: false,
    },
    {
      name: 'DONATE.TABLE.AMOUNT',
      value: 'amount',
      sort: false,
      showSort: false,
    },
  ];

  private readonly filterDataTypesEnum = FilterDataTypesEnum;

  filterSettings: FilterSettings = {
    data: {
      filter_title: {
        col: 2,
        type: this.filterDataTypesEnum.INPUT,
        title: this.translateService.instant('DONATE.FILTER.ID.TITLE'),
        placeholder: this.translateService.instant('DONATE.FILTER.ID.PLACEHOLDER'),
        data: [],
      },
      filter_name: {
        col: 2,
        type: this.filterDataTypesEnum.INPUT,
        title: this.translateService.instant('DONATE.FILTER.NAME.TITLE'),
        placeholder: this.translateService.instant('DONATE.FILTER.NAME.PLACEHOLDER'),
        data: [],
      },
      filter_system: {
        col: 1,
        type: this.filterDataTypesEnum.MULTI_SELECT,
        title: this.translateService.instant('DONATE.FILTER.SYSTEM.TITLE'),
        placeholder: this.translateService.instant('DONATE.FILTER.SYSTEM.PLACEHOLDER'),
        data: [],
      },
      filter_startData: {
        col: 2,
        type: this.filterDataTypesEnum.DATE,
        title: this.translateService.instant('DONATE.FILTER.DATE_FROM.TITLE'),
        placeholder: this.translateService.instant('DONATE.FILTER.DATE_FROM.PLACEHOLDER'),
        data: [],
      },
      filter_endData: {
        col: 2,
        type: this.filterDataTypesEnum.DATE,
        title: this.translateService.instant('DONATE.FILTER.DATE_TO.TITLE'),
        placeholder: this.translateService.instant('DONATE.FILTER.DATE_TO.PLACEHOLDER'),
        data: [],
      },
      filter_amount: {
        col: 1,
        type: this.filterDataTypesEnum.INPUT,
        title: this.translateService.instant('DONATE.FILTER.AMOUNT.TITLE'),
        placeholder: this.translateService.instant('DONATE.FILTER.AMOUNT.PLACEHOLDER'),
        data: [],
      },
    },
  };

  constructor(
    private readonly donateService: DonateService,
    private readonly donateStateService: DonateStateService,
    protected readonly modalService: ModalService,
    private readonly translateService: TranslateService,
    private readonly filterStateService: FilterStateService,
    private readonly dataTimeService: DatetimeService,
  ) {
  }

  ngOnInit(): void {
    this.getRequestParams();
    this.getPaginationParams();
    this.getFilterParams();
  }

  getRequestParams() {
    this.subscriptions.add(
      this.donateStateService.requestParams$.pipe(
        switchMap((requestParams) => {
          this.changeData = true;
          this.requestData = requestParams;
          return this.donateService.getList(this.requestData);
        }),
      ).subscribe((response) => {
        this.changeData = false;
        this.loadingData = false;
        this.total = response.total;
        this.donates = response.post;
        this.pagination.total = response.total;
      }),
    );
  }

  getFilterParams() {
    this.subscriptions.add(
      this.donateStateService.donateCategory$.pipe(
        switchMap((response) => {
          this.donateCategory = response;
          this.filterSettings.data.filter_system.data = response;
          this.filterStateService.setFilterSettings({ ...this.filterSettings });
          return this.filterStateService.filterSaveData$;
        }),
      ).subscribe((response) => {
        if (Object.keys(response).length > 0) {
          this.filterCombineData(response);
        }
      }),
    );
  }

  filterCombineData(confirm: RequestDonate) {
    const object: RequestDonate = {
      filter_name: confirm.filter_name ? confirm.filter_name : '',
      filter_title: confirm.filter_title ? confirm.filter_title : '',
      filter_system: confirm.filter_system ? confirm.filter_system.join() : '',
      filter_amount: confirm.filter_amount ? confirm.filter_amount : '',
      filter_startData: confirm.filter_startData ? this.dataTimeService.convertDate(confirm.filter_startData) : '',
      filter_endData: confirm.filter_endData ? this.dataTimeService.convertDate(confirm.filter_endData) : '',
    };
    this.donateStateService.setRequestParams({ ...this.requestData, ...object, offset: 0 });
    this.pagination.currentPage = 1;
    this.pagination.offset = 0;
  }

  getPaginationParams() {
    this.subscriptions.add(
      this.donateStateService.paginationParams$.subscribe((paginationParams) => {
        if (JSON.stringify(this.pagination) !== JSON.stringify(paginationParams)) {
          this.pagination = paginationParams;
          this.donateStateService.setRequestParams({ ...this.requestData, ...paginationParams });
        }
      }),
    );
  }

  donateSort(type: string, order: boolean, index: number) {
    this.table = this.table.map((item) => {
      return {
        ...item,
        showSort: false,
      };
    });

    this.table[index].showSort = true;
    this.table[index].sort = !order;

    this.donateStateService.setRequestParams({
      ...this.requestData,
      orderby: type,
      order: order ? 'DESC' : 'ASC',
    });
  }

  numberWithCommas(amount: string) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  changeCount(count: number) {
    this.donateStateService.setPaginationParams({
      ...this.pagination,
      posts_per_page: count,
      currentPage: 1,
      offset: 0,
    });
  }

  changePage(page: number) {
    this.donateStateService.setPaginationParams({
      ...this.pagination,
      offset: page * this.pagination.posts_per_page - this.pagination.posts_per_page,
      currentPage: page,
    });
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.filterStateService.resetFilterState();
    this.donateStateService.resetRequestParams();
    this.donateStateService.resetPaginationParams();
  }
}
