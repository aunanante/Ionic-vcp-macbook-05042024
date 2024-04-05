import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateDetailModalPage } from './update-detail-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateDetailModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateDetailModalPageRoutingModule {}
