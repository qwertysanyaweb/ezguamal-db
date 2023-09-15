import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NotifierModule } from 'angular-notifier';

import { SharedModule } from './shared/shared.module';

import { AppInitializeService } from './core/services/app-initialize.service';
import { AuthGuard } from './core/guard/auth.guard';
import { LoginGuard } from './core/guard/login.guard';
import { CoreModule } from './core/core.module';
import { LanguageService } from './core/services/language.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent, ContentLayoutComponent, SidebarComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 20,
        },
        vertical: {
          position: 'bottom',
          distance: 20,
          gap: 20,
        },
      },
    }),
  ],
  providers: [
    AuthGuard,
    LoginGuard,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (appInitialize: AppInitializeService) => {
        return () => {
          return appInitialize.load();
        };
      },
      deps: [AppInitializeService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private langService: LanguageService) {
    this.langService.installLangOnBoot();
  }
}
