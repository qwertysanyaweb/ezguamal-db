import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharityListComponent } from './components/charity-list/charity-list.component';

const routes: Routes = [
  {
    path: '',
    component: CharityListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharityRoutingModule {
}
