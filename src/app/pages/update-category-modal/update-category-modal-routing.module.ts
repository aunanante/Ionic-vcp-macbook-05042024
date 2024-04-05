import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateCategoryModalPage } from './update-category-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateCategoryModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateCategoryModalPageRoutingModule {}
