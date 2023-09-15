import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { CoreUsersService } from '../services/core-users.service';
import { ApiCoreService } from '../services/api-core.service';
import { LOCAL_STORAGE } from '../tokens/local-storage';
import { token } from '../interfaces/user';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    @Inject(LOCAL_STORAGE) private readonly localStorage: Storage,
    private authService: CoreUsersService,
    private apiService: ApiCoreService,
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const refreshTokenUrl = 'api-bearer-auth/v1/tokens/refresh';
    let refresh = false;
    let accessToken = this.localStorage.getItem('access_token');
    let refreshToken = this.localStorage.getItem('refresh_token');

    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {

        if (!refreshToken) {
          this.authService.logout();
          return throwError(err);
        }

        if (err.status === 401 && !refresh && req.url === refreshTokenUrl) {
          this.authService.setIsAuth(false);
          this.authService.logout();
          return throwError(err);
        }

        if (err.status === 401 && !refresh) {
          refresh = true;
          return this.apiService
            .post(refreshTokenUrl, { token: refreshToken })
            .pipe(
              switchMap((res: token) => {

                this.localStorage.setItem('access_token', res.access_token);
                accessToken = res.access_token;
                this.authService.setIsAuth(true);
                refresh = false;
                return next.handle(
                  request.clone({
                    setHeaders: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }),
                );
              }),
              catchError((error) => {
                refresh = false;
                this.authService.setIsAuth(false);
                this.authService.logout();
                return throwError(error);
              }),
            );
        }
        return throwError(err);
      }),
    );
  }
}
