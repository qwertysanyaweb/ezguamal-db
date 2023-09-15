import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CoreUsersService } from '../services/core-users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: CoreUsersService, public router: Router) {
  }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree
    | any {
    if (this.authService.authValue) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
