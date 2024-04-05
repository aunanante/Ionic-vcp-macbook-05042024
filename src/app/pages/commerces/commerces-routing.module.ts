import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommercesPage } from './commerces.page';

const routes: Routes = [
  {
    path: '',
    component: CommercesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercesPageRoutingModule {}
