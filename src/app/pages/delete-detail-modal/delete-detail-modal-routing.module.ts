import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteDetailModalPage } from './delete-detail-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteDetailModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteDetailModalPageRoutingModule {}
