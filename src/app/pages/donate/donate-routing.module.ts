import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonateListComponent } from './components/donate-list/donate-list.component';

const routes: Routes = [
  {
    path: '',
    component: DonateListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonateRoutingModule {
}
