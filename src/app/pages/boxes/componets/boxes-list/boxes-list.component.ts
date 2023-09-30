import { Component, OnDestroy, OnInit } from '@angular/core';
import { Box, BoxesPaginationParams, RequestBoxes } from '../../interfaces/boxes';
import { BoxesStateService } from '../../services/boxes-state.service';
import { BoxesService } from '../../services/boxes.service';
import { switchMap } from 'rxjs/operators';
import { ModalService } from '../../../../core/services/modal.service';
import { FilterSettings } from '../../../../features/filter/interfaces/filter-settings';
import { FilterDataTypesEnum } from '../../../../features/filter/enums/filter-data-types.enum';
import { TranslateService } from '@ngx-translate/core';
import { FilterStateService } from '../../../../features/filter/states/filter-state.service';
import { DatetimeService } from '../../../../core/services/datetime.service';
import { NotifierService } from 'angular-notifier';
import { CoreUsersService } from '../../../../core/services/core-users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-boxes-list',
  templateUrl: './boxes-list.component.html',
  styleUrls: ['./boxes-list.component.scss'],
  providers: [ModalService],
})
export class BoxesListComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  boxes: Box[] = [];

  requestData: RequestBoxes = {};

  loadingData: boolean = true;

  total: number = 0;

  limit: number = 10;

  pagination: BoxesPaginationParams = {
    currentPage: 1,
    posts_per_page: this.limit,
    offset: 0,
    total: 0,
  };

  changeData: boolean = false;

  table: { name: string, value: string, sort: boolean, showSort: boolean, sortable: boolean }[] = [
    {
      name: 'BOXES.TABLE.NUMBER',
      value: 'box_number',
      sort: true,
      showSort: false,
      sortable: true,
    },
    {
      name: 'BOXES.TABLE.BRAND',
      value: 'brand',
      sort: true,
      showSort: false,
      sortable: true,
    },
    {
      name: 'BOXES.TABLE.REGION',
      value: 'region',
      sort: false,
      showSort: false,
      sortable: false,
    },
    {
      name: 'BOXES.TABLE.ADDRESS',
      value: 'box_address',
      sort: false,
      showSort: false,
      sortable: false,
    },
    {
      name: 'BOXES.TABLE.PHONE',
      value: 'box_phone',
      sort: false,
      showSort: false,
      sortable: false,
    },
    {
      name: 'BOXES.TABLE.DATE_CREATE',
      value: 'date',
      sort: true,
      showSort: false,
      sortable: true,
    },
    {
      name: 'BOXES.TABLE.DATE_CLOSE',
      value: 'box_dataClose',
      sort: false,
      showSort: false,
      sortable: false,
    },
  ];

  boxSortList: { name: string, id: string }[] = [
    {
      id: 'publish',
      name: 'BOXES.SORT_LIST.PUBLISH',
    },
    {
      id: 'close',
      name: 'BOXES.SORT_LIST.CLOSE',
    },
    {
      id: '',
      name: 'BOXES.SORT_LIST.ALL',
    },
  ];

  changeStateLoad: boolean = false;

  rolesButton = {
    add: false,
    edit: false,
    report: false,
    view: false,
    clear: false,
  };

  private readonly filterDataTypesEnum = FilterDataTypesEnum;

  filterSettings: FilterSettings = {
    data: {
      filter_boxNumber: {
        col: 2,
        type: this.filterDataTypesEnum.INPUT,
        title: this.translateService.instant('BOXES.FILTER.NUMBER.TITLE'),
        placeholder: this.translateService.instant('BOXES.FILTER.NUMBER.PLACEHOLDER'),
        data: [],
      },
      filter_group: {
        col: 2,
        type: this.filterDataTypesEnum.SELECT,
        title: this.translateService.instant('BOXES.FILTER.GROUP.TITLE'),
        placeholder: this.translateService.instant('BOXES.FILTER.GROUP.PLACEHOLDER'),
        data: [],
      },
      filter_brand: {
        col: 2,
        type: this.filterDataTypesEnum.MULTI_SELECT,
        title: this.translateService.instant('BOXES.FILTER.BRAND.TITLE'),
        placeholder: this.translateService.instant('BOXES.FILTER.BRAND.PLACEHOLDER'),
        data: [],
      },
      filter_category: {
        col: 2,
        type: this.filterDataTypesEnum.MULTI_SELECT,
        title: this.translateService.instant('BOXES.FILTER.CATEGORY.TITLE'),
        placeholder: this.translateService.instant('BOXES.FILTER.CATEGORY.PLACEHOLDER'),
        data: [],
      },
      filter_startData: {
        col: 2,
        type: this.filterDataTypesEnum.DATE,
        title: this.translateService.instant('BOXES.FILTER.ADD_START_DATA.TITLE'),
        placeholder: this.translateService.instant('BOXES.FILTER.ADD_START_DATA.PLACEHOLDER'),
        data: [],
      },
      filter_endData: {
        col: 2,
        type: this.filterDataTypesEnum.DATE,
        title: this.translateService.instant('BOXES.FILTER.ADD_END_DATA.TITLE'),
        placeholder: this.translateService.instant('BOXES.FILTER.ADD_END_DATA.PLACEHOLDER'),
        data: [],
      },
    },
  };

  constructor(
    private readonly boxesStateService: BoxesStateService,
    private readonly boxesService: BoxesService,
    private readonly translateService: TranslateService,
    private readonly filterStateService: FilterStateService,
    protected readonly modalService: ModalService,
    private readonly dataTimeService: DatetimeService,
    private readonly notifierService: NotifierService,
    private readonly coreUserService: CoreUsersService,
  ) {
  }

  accept() {
    this.subscriptions.add(
      this.coreUserService.userData$.subscribe((response) => {
        if (response.roles.create_posts) {
          this.rolesButton.add = response.roles.create_posts;
        }
        if (response.roles.boxes_report) {
          this.rolesButton.report = response.roles.boxes_report;
        }
        if (response.roles.edit_posts) {
          this.rolesButton.edit = response.roles.edit_posts;
        }
      }),
    );
  }

  ngOnInit(): void {
    this.accept();
    this.setupFilters();
    this.getRequestParams();
    this.getPaginationParams();
    this.getFilterParams();
  }

  getRequestParams() {
    this.subscriptions.add(
      this.boxesStateService.requestParams$.pipe(
        switchMap((requestParams) => {
          this.changeData = true;
          this.requestData = requestParams;
          return this.boxesService.getList(this.requestData);
        }),
      ).subscribe((response) => {
        this.changeData = false;
        this.loadingData = false;
        this.total = response.total;
        this.boxes = response.post;
        this.pagination.total = response.total;
      }),
    );
  }

  getPaginationParams() {
    this.subscriptions.add(
      this.boxesStateService.paginationParams$.subscribe((paginationParams) => {
        if (JSON.stringify(this.pagination) !== JSON.stringify(paginationParams)) {
          this.pagination = paginationParams;
          this.boxesStateService.setRequestParams({ ...this.requestData, ...paginationParams });
        }
      }),
    );
  }

  setupFilters(): void {
    this.subscriptions.add(
      this.boxesStateService.category$.subscribe((response) => {
        this.filterSettings.data.filter_category.data = response.region;
        this.filterSettings.data.filter_brand.data = response.brand;
        this.filterSettings.data.filter_group.data = response.group;
        this.filterStateService.setFilterSettings({ ...this.filterSettings });
      }),
    );
  }

  getFilterParams() {
    this.subscriptions.add(
      this.filterStateService.filterSaveData$.subscribe((response) => {
        if (Object.keys(response).length > 0) {
          this.filterSettings = { ...this.filterSettings, savedData: response, save: true };
          this.filterCombineData(response);
        }
      }),
    );
  }

  filterCombineData(confirm: RequestBoxes) {
    const object: RequestBoxes = {
      filter_boxNumber: confirm.filter_boxNumber ? confirm.filter_boxNumber : '',
      filter_brand: confirm.filter_brand ? confirm.filter_brand.join() : '',
      filter_group: confirm.filter_group ? confirm.filter_group : '',
      filter_category: confirm.filter_category ? confirm.filter_category.join() : '',
      filter_startData: confirm.filter_startData ? this.dataTimeService.convertDate(confirm.filter_startData) : '',
      filter_endData: confirm.filter_endData ? this.dataTimeService.convertDate(confirm.filter_endData) : '',
    };
    this.boxesStateService.setRequestParams({ ...this.requestData, ...object, offset: 0 });
    this.pagination.currentPage = 1;
    this.pagination.offset = 0;
  }

  changeCount(count: number) {
    this.boxesStateService.setPaginationParams({
      ...this.pagination,
      posts_per_page: count,
      currentPage: 1,
      offset: 0,
    });
  }

  changePage(page: number) {
    this.boxesStateService.setPaginationParams({
      ...this.pagination,
      offset: page * this.pagination.posts_per_page - this.pagination.posts_per_page,
      currentPage: page,
    });
  }

  selectState($event: any) {
    this.boxesStateService.setRequestParams({ ...this.requestData, 'post_status': $event.target?.value });
  }

  boxesSort(type: string, order: boolean, index: number) {
    this.table = this.table.map((item) => {
      return {
        ...item,
        showSort: false,
      };
    });

    this.table[index].showSort = true;
    this.table[index].sort = !order;

    this.boxesStateService.setRequestParams({
      ...this.requestData,
      orderby: type,
      order: order ? 'DESC' : 'ASC',
    });
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  changeState(id: number, state: string) {
    this.changeStateLoad = true;
    this.subscriptions.add(
      this.boxesService.changeState({ id, state }).subscribe((response) => {
        this.changeStateLoad = false;
        if (response) {
          this.boxesStateService.setRequestParams(this.requestData);
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
