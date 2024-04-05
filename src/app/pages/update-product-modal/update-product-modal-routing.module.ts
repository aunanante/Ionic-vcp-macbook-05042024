import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateProductModalPage } from './update-product-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateProductModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateProductModalPageRoutingModule {}
