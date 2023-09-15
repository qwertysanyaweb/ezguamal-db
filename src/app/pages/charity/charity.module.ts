import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { CharityRoutingModule } from './charity-routing.module';
import { CharityListComponent } from './components/charity-list/charity-list.component';


@NgModule({
  declarations: [
    CharityListComponent
  ],
  imports: [
    CharityRoutingModule, SharedModule, CoreModule,
  ],
})
export class CharityModule {
}
