import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailAddModalPage } from './detail-add-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DetailAddModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailAddModalPageRoutingModule {}
