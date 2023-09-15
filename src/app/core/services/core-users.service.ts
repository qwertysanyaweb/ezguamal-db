import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCoreService } from './api-core.service';
import { LOCAL_STORAGE } from '../tokens/local-storage';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User, UserAuthorization } from '../interfaces/user';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class CoreUsersService {
  defaultUserData: User = {
    'ID': 0,
    'user_login': '',
    'user_email': '',
    'display_name': '',
    'roles_name': '',
    'roles': [],
  };

  private readonly _isAuth = new BehaviorSubject<boolean>(false);

  public readonly isAuth$ = this._isAuth.asObservable();

  private readonly _userData$ = new BehaviorSubject<User>(this.defaultUserData);

  public userData$ = this._userData$.asObservable();

  constructor(
    @Inject(LOCAL_STORAGE) private readonly localStorage: Storage,
    private readonly router: Router,
    private readonly api: ApiCoreService,
  ) {
  }

  public get userData() {
    return this._userData$.value;
  }

  public get authValue() {
    return this._isAuth.value;
  }

  public setUserData(user: User) {
    this._userData$.next(user);
  }

  public setIsAuth(auth: boolean) {
    this._isAuth.next(auth);
  }

  login(data: { username: string, password: string }): Observable<UserAuthorization> {
    return this.api.post('api-bearer-auth/v1/login', data).pipe(
      map((item: UserAuthorization) => {
        return {
          'wp_user': {
            'data': {
              'ID': item.wp_user.data.ID,
              'user_login': item.wp_user.data.user_login,
              'user_email': item.wp_user.data.user_email,
              'display_name': item.wp_user.data.display_name,
            },
            'ID': item.wp_user.ID,
            'allcaps': item.wp_user.allcaps,
            'roles_name': item.wp_user.roles_name,
          },
          'access_token': item.access_token,
          'expires_in': item.expires_in,
          'refresh_token': item.refresh_token,
        };
      }),
      tap((response) => {
        this.setIsAuth(true);
        this.setUserData(
          {
            user_login: response.wp_user.data.user_login,
            user_email: response.wp_user.data.user_email,
            ID: response.wp_user.data.ID,
            display_name: response.wp_user.data.display_name,
            roles_name: response.wp_user.roles_name,
            roles: response.wp_user.allcaps,
          },
        );
        this.localStorage.setItem('access_token', response.access_token);
        this.localStorage.setItem('refresh_token', response.refresh_token);

        return response;
      }),
      catchError((loginError) => {
        return throwError(loginError);
      }),
    );
  }

  getUser(): Observable<User> {
    return this.api.post('user/getUser', '');
  }

  logout() {
    this.removeTokens();
    this.router.navigate(['/login']);
  }

  removeTokens() {
    this.setIsAuth(false);
    this.setUserData(this.defaultUserData);
    const lang = <string>this.localStorage.getItem('language');
    this.localStorage.clear();
    this.localStorage.setItem('language', lang);
  }
}
