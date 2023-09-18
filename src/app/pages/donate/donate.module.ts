import { NgModule } from '@angular/core';
import { DonateListComponent } from './components/donate-list/donate-list.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { DonateRoutingModule } from './donate-routing.module';
import { ModalComponent } from '../../features/modal/modal.component';
import { FilterModule } from '../../features/filter/filter.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DonateReportComponent } from './components/donate-report/donate-report.component';


@NgModule({
  declarations: [
    DonateListComponent,
    ModalComponent,
    DonateReportComponent,
  ],
  imports: [
    DonateRoutingModule, SharedModule, CoreModule, FilterModule, NgxPaginationModule,
  ],
})
export class DonateModule {

}
