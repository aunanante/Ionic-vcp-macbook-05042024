import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductModalAddPage } from './product-modal-add.page';

const routes: Routes = [
  {
    path: '',
    component: ProductModalAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductModalAddPageRoutingModule {}
