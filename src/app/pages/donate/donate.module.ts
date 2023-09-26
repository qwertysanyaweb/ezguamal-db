import { NgModule } from '@angular/core';
import { DonateListComponent } from './components/donate-list/donate-list.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { DonateRoutingModule } from './donate-routing.module';
import { ModalComponent } from '../../features/modal/modal.component';
import { FilterModule } from '../../features/filter/filter.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DonateReportComponent } from './components/donate-report/donate-report.component';
import { DonateAddComponent } from './components/donate-add/donate-add.component';
import { DonateComponent } from './components/donate/donate.component';
import { DestroyService } from '../../core/services/destroy.service';


@NgModule({
  declarations: [
    DonateListComponent,
    ModalComponent,
    DonateReportComponent,
    DonateAddComponent,
    DonateComponent,
  ],
  imports: [
    DonateRoutingModule, SharedModule, CoreModule, FilterModule, NgxPaginationModule,
  ],
  exports: [
    ModalComponent,
  ],
  providers: [
    DestroyService,
  ],
})
export class DonateModule {

}
