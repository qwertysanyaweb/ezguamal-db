import { Injectable } from '@angular/core';
import { ApiCoreService } from '../../../core/services/api-core.service';
import { Observable } from 'rxjs';
import {
  BoxesCategoryResponse,
  BoxesResponse,
  RequestAddBox,
  RequestBoxes,
  RequestOpenBox,
  RequestReport,
  ResponseReport,
} from '../interfaces/boxes';

@Injectable({
  providedIn: 'root',
})
export class BoxesService {

  constructor(
    private readonly apiCoreService: ApiCoreService,
  ) {
  }

  getList(params: RequestBoxes): Observable<BoxesResponse> {
    return this.apiCoreService.get('boxes/getBoxes', params);
  }

  changeState(param: { id: number; state: string }): Observable<boolean> {
    return this.apiCoreService.post('boxes/changeState', param);
  }

  getCategory(): Observable<BoxesCategoryResponse> {
    return this.apiCoreService.get('boxes/category', '');
  }

  addBrand(params: { brandName: string, description: string }): Observable<boolean> {
    return this.apiCoreService.post('boxes/addBrand', params);
  }

  reports(params: RequestReport): Observable<ResponseReport> {
    return this.apiCoreService.post('boxes/reports', params);
  }

  addBox(params: RequestAddBox): Observable<boolean> {
    return this.apiCoreService.post('boxes/addBox', params);
  }

  editBox(params: RequestAddBox, id: number): Observable<boolean> {
    return this.apiCoreService.patch(`boxes/changeBox/${id}`, params);
  }

  openBox(params: RequestOpenBox): Observable<boolean> {
    return this.apiCoreService.post(`boxes/open`, params);
  }
}
