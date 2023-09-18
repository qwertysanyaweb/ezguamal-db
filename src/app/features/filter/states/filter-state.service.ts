import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterSettings } from '../interfaces/filter-settings';
import { filter, map, tap } from 'rxjs/operators';

const EMPTY_OBJECT = '{}';

function isEmptyObject(obj: FilterSettings) {
  return JSON.stringify(obj.data) !== EMPTY_OBJECT;
}

@Injectable({
  providedIn: 'root',
})
export class FilterStateService {
  settings: FilterSettings = {
    data: {},
  };
  filterParams: any = {};

  private readonly _filterDataSubject$ = new BehaviorSubject<FilterSettings>(this.settings);

  public filterData$ = this._filterDataSubject$.asObservable().pipe(
    tap(() => this.setLoading(true)),
    map((a) => {
      return a;
    }),
    filter(isEmptyObject),
    tap(() => this.setLoading(false)),
  );

  private _loadingSubject = new BehaviorSubject(false);
  public loading$ = this._loadingSubject.asObservable();

  private _filterSaveData = new BehaviorSubject(this.filterParams);

  public filterSaveData$ = this._filterSaveData.asObservable();

  public setFilterParams(params: any) {
    this._filterSaveData.next(params);
  }

  public setFilterSettings(filterSettings: FilterSettings): void {
    this._filterDataSubject$.next(filterSettings);
  }

  public resetFilterState(): void {
    this._filterDataSubject$.next(this.settings);
    this._filterSaveData.next(this.filterParams);
  }

  public setLoading(loading: boolean) {
    this._loadingSubject.next(loading);
  }
}
