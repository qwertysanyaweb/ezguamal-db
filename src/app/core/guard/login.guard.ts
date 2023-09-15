import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { CoreUsersService } from '../services/core-users.service';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private authService: CoreUsersService, public router: Router) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.authValue) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
