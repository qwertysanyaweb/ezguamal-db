import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './components/filter/filter.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [FilterComponent],
  imports: [CommonModule, SharedModule, CoreModule],
  exports: [FilterComponent],
  providers: [],
})
export class FilterModule {
}
