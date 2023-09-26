import { NgModule } from '@angular/core';
import { BoxesListComponent } from './componets/boxes-list/boxes-list.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { BoxesRoutingModule } from './boxes-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { BoxesEventComponent } from './componets/boxes-event/boxes-event.component';
import { BoxesViewComponent } from './componets/boxes-view/boxes-view.component';
import { BoxesComponent } from './componets/boxes/boxes.component';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';
import { FilterModule } from '../../features/filter/filter.module';
import { DonateModule } from '../donate/donate.module';
import { BoxesReportComponent } from './componets/boxes-report/boxes-report.component';
import { BoxesAddBrandComponent } from './componets/boxes-add-brand/boxes-add-brand.component';
import { DestroyService } from '../../core/services/destroy.service';
import { BoxesOpenComponent } from './componets/boxes-open/boxes-open.component';

const mapConfig: YaConfig = {
  apikey: '75e91e4f-55b9-42a1-9c08-39b11ebc1ac5',
  lang: 'ru_RU',
};

@NgModule({
  declarations: [
    BoxesListComponent,
    BoxesEventComponent,
    BoxesViewComponent,
    BoxesComponent,
    BoxesReportComponent,
    BoxesAddBrandComponent,
    BoxesOpenComponent,
  ],
  imports: [
    BoxesRoutingModule,
    SharedModule,
    CoreModule,
    NgxPaginationModule,
    AngularYandexMapsModule,
    AngularYandexMapsModule.forRoot(mapConfig),
    FilterModule,
    DonateModule,
  ],
  providers: [
    DestroyService,
  ],
})
export class BoxesModule {
}
