import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VillesModalPage } from './villes-modal.page';

const routes: Routes = [
  {
    path: '',
    component: VillesModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VillesModalPageRoutingModule {}
