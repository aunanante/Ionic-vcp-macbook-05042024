import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteCategoryModalPage } from './delete-category-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteCategoryModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteCategoryModalPageRoutingModule {}
