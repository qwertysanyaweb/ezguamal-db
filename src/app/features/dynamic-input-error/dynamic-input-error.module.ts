import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicInputErrorComponent} from "./dynamic-input-error.component";
import {DynamicValidatorMessageDirective} from "./directives/dynamic-validator-message.directive";
import {DynamicInputErrorMessagesPipe} from "./pipes/dynamic-input-error-messages.pipe";



@NgModule({
  declarations: [
    DynamicInputErrorComponent,
    DynamicValidatorMessageDirective,
    DynamicInputErrorMessagesPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DynamicInputErrorComponent,
    DynamicValidatorMessageDirective,
    DynamicInputErrorMessagesPipe
  ]
})
export class DynamicInputErrorModule { }
