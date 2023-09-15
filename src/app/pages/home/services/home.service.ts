import { Injectable } from '@angular/core';
import { ApiCoreService } from '../../../core/services/api-core.service';
import { Observable } from 'rxjs';
import { User } from '../../../core/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class HomeService {

  constructor(
    private readonly api: ApiCoreService,
  ) {
  }

  getUser(): Observable<User> {
    return this.api.post('user/getUser', '');
  }
}
