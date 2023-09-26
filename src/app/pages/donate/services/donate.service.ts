import { Injectable } from '@angular/core';
import { ApiCoreService } from '../../../core/services/api-core.service';
import {
  DonateAddRequest,
  DonateCategory,
  DonateReport,
  DonateReportRequest,
  DonateResponse,
  RequestDonate,
} from '../interfaces/donate';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DonateService {

  constructor(
    private readonly apiCoreService: ApiCoreService,
  ) {
  }

  getList(params: RequestDonate): Observable<DonateResponse> {
    return this.apiCoreService.get('/donate/getList', params);
  }

  reports(params: DonateReportRequest): Observable<DonateReport[]> {
    return this.apiCoreService.post('/donate/report', params);
  }

  getCategory(): Observable<DonateCategory[]> {
    return this.apiCoreService.get('/donate/category', '');
  }

  addDonate(params: DonateAddRequest): Observable<boolean> {
    return this.apiCoreService.post('/donate/add', params);
  }
}
