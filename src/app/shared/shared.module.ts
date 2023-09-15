import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicInputErrorModule } from '../features/dynamic-input-error/dynamic-input-error.module';

@NgModule({
  declarations: [],
  imports: [
    CoreModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    DynamicInputErrorModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    DynamicInputErrorModule,
  ],
  providers: [],
})
export class SharedModule {

}
