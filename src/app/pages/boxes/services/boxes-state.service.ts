import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoxesCategoryResponse, BoxesPaginationParams, RequestBoxes } from '../interfaces/boxes';

@Injectable({
  providedIn: 'root',
})
export class BoxesStateService {

  limit: number = 10;

  requestData: RequestBoxes = {
    posts_per_page: this.limit,
    offset: 0,
    post_status: 'publish',
  };

  paginationParams: BoxesPaginationParams = {
    currentPage: 1,
    posts_per_page: this.limit,
    offset: 0,
    total: 0,
  };

  changeCategory: boolean = false;

  boxesCategory: BoxesCategoryResponse = {
    brand: [],
    region: [],
  };

  private _paginationParamsSubject = new BehaviorSubject(this.paginationParams);

  public paginationParams$ = this._paginationParamsSubject.asObservable();

  private _requestParamsSubject = new BehaviorSubject(this.requestData);

  public requestParams$ = this._requestParamsSubject.asObservable();

  private _changeCategory = new BehaviorSubject(this.changeCategory);

  public changeCategory$ = this._changeCategory.asObservable();

  private _category = new BehaviorSubject(this.boxesCategory);

  public category$ = this._category.asObservable();

  public setRequestParams(requestParams: RequestBoxes) {
    this._requestParamsSubject.next(requestParams);
  }

  public setPaginationParams(paginationParams: BoxesPaginationParams) {
    this._paginationParamsSubject.next(paginationParams);
  }

  public setChangeCategory(value: boolean) {
    this._changeCategory.next(value);
  }

  public setCategory(category: BoxesCategoryResponse) {
    this._category.next(category);
  }

  public resetRequestParams(): void {
    this.setRequestParams(this.requestData);
  }

  public resetPaginationParams(): void {
    this.setPaginationParams(this.paginationParams);
  }
}
