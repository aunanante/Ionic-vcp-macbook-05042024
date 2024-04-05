import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteProductModalPage } from './delete-product-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteProductModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteProductModalPageRoutingModule {}
