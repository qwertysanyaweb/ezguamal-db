import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicInputErrorModule } from '../features/dynamic-input-error/dynamic-input-error.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, ruLocale } from 'ngx-bootstrap/chronos';
import { PaginationComponent } from '../features/pagination/pagination.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [PaginationComponent],
  imports: [
    CoreModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    DynamicInputErrorModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    NgxPaginationModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    DynamicInputErrorModule,
    NgSelectModule,
    BsDatepickerModule,
    PaginationComponent,
  ],
  providers: [],
})
export class SharedModule {
  constructor(localeService: BsLocaleService) {
    defineLocale('ru', ruLocale);
    localeService.use('ru');
  }
}
