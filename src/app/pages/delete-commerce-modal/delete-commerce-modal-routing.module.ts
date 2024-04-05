import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteCommerceModalPage } from './delete-commerce-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteCommerceModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteCommerceModalPageRoutingModule {}
