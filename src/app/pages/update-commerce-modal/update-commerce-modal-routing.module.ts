import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateCommerceModalPage } from './update-commerce-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateCommerceModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateCommerceModalPageRoutingModule {}
