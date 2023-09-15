import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { HomeRoutingModule } from './home-routing.module';


@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    HomeRoutingModule, SharedModule, CoreModule,
  ],
})
export class HomeModule {
}
