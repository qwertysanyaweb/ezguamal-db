import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharityListComponent } from './components/charity-list/charity-list.component';
import { CharityViewComponent } from './components/charity-view/charity-view.component';

const routes: Routes = [
  {
    path: '',
    component: CharityListComponent,
  },
  {
    path: 'view/:id',
    component: CharityViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharityRoutingModule {
}
