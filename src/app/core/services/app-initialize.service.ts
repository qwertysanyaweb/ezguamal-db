import { Inject, Injectable } from '@angular/core';
import { CoreUsersService } from './core-users.service';
import { Observable, of } from 'rxjs';
import { LOCAL_STORAGE } from '../tokens/local-storage';
import { catchError, map, take } from 'rxjs/operators';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AppInitializeService {
  constructor(
    @Inject(LOCAL_STORAGE) private readonly localStorage: Storage,
    private readonly coreUsersService: CoreUsersService,
  ) {
  }

  load(): Observable<any> {
    return this.coreUsersService.getUser().pipe(
      take(5),
      map((response: User) => {
        this.coreUsersService.setUserData(response);
        this.coreUsersService.setIsAuth(true);
      }),
      catchError(() => {
        this.coreUsersService.setIsAuth(false);
        return of([]);
      }),
    );
  }
}
