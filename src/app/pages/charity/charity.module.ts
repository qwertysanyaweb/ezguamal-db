import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { CharityRoutingModule } from './charity-routing.module';
import { CharityListComponent } from './components/charity-list/charity-list.component';
import { CharityViewComponent } from './components/charity-view/charity-view.component';


@NgModule({
  declarations: [
    CharityListComponent,
    CharityViewComponent
  ],
  imports: [
    CharityRoutingModule, SharedModule, CoreModule,
  ],
})
export class CharityModule {
}
