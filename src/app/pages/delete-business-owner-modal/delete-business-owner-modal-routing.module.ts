import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteBusinessOwnerModalPage } from './delete-business-owner-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteBusinessOwnerModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteBusinessOwnerModalPageRoutingModule {}
