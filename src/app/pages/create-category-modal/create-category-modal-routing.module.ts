import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCategoryModalPage } from './create-category-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCategoryModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCategoryModalPageRoutingModule {}
