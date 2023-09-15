import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { LoginGuard } from './core/guard/login.guard';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'charity',
        loadChildren: () => import('./pages/charity/charity.module').then((m) => m.CharityModule),
      },
    ],
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadChildren: () => import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
