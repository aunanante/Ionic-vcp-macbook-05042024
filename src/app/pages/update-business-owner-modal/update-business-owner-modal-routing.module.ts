import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateBusinessOwnerModalPage } from './update-business-owner-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateBusinessOwnerModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateBusinessOwnerModalPageRoutingModule {}
