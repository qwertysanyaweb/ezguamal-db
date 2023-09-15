import { NgModule } from '@angular/core';

import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [AuthComponent, LoginComponent],
  imports: [AuthRoutingModule, SharedModule, CoreModule],
})
export class AuthModule {
}
