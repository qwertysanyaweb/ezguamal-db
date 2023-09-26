import { Injectable } from '@angular/core';

import { DonateCategory, DonatePaginationParams, RequestDonate } from '../interfaces/donate';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DonateStateService {

  limit: number = 10;

  requestData: RequestDonate = {
    posts_per_page: this.limit,
    offset: 0,
  };

  paginationParams: DonatePaginationParams = {
    currentPage: 1,
    posts_per_page: this.limit,
    offset: 0,
    total: 0,
  };

  changeList: boolean = false;

  donateCategory: DonateCategory[] = [];

  private _paginationParamsSubject = new BehaviorSubject(this.paginationParams);

  public paginationParams$ = this._paginationParamsSubject.asObservable();

  private _requestParamsSubject = new BehaviorSubject(this.requestData);

  public requestParams$ = this._requestParamsSubject.asObservable();

  private _changeList = new BehaviorSubject(this.changeList);

  public changeList$ = this._changeList.asObservable();

  private _donateCategory = new BehaviorSubject(this.donateCategory);

  public donateCategory$ = this._donateCategory.asObservable();

  public setRequestParams(requestParams: RequestDonate) {
    this._requestParamsSubject.next(requestParams);
  }

  public setPaginationParams(paginationParams: DonatePaginationParams) {
    this._paginationParamsSubject.next(paginationParams);
  }

  public setChangeList(value: boolean) {
    this._changeList.next(value);
  }

  public setDonateCategory(category: DonateCategory[]) {
    this._donateCategory.next(category);
  }

  public resetRequestParams(): void {
    this.setRequestParams(this.requestData);
  }

  public resetPaginationParams(): void {
    this.setPaginationParams(this.paginationParams);
  }
}
