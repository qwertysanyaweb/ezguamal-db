import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SpinnerDirective } from './directive/spinner.directive';
import { SanitizerPipe } from './pipe/sanitizer.pipe';

@NgModule({
  imports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  declarations: [
    SpinnerDirective,
    SanitizerPipe,
  ],
  exports: [
    SpinnerDirective,
    SanitizerPipe,
  ],
})
export class CoreModule {
}
