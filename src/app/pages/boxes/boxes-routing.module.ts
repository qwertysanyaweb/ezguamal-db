import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxesListComponent } from './componets/boxes-list/boxes-list.component';
import { BoxesEventComponent } from './componets/boxes-event/boxes-event.component';
import { BoxesViewComponent } from './componets/boxes-view/boxes-view.component';
import { BoxesComponent } from './componets/boxes/boxes.component';


const routes: Routes = [
  {
    path: '',
    component: BoxesComponent,
    children: [
      {
        path: '',
        component: BoxesListComponent,
      },
      {
        path: 'view/:id',
        component: BoxesViewComponent,
      },
      {
        path: ':event',
        component: BoxesEventComponent,
      },
      {
        path: 'edit/:id',
        component: BoxesEventComponent,
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoxesRoutingModule {
}
