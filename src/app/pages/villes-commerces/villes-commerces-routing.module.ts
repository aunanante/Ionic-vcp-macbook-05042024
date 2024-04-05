import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VillesCommercesPage } from './villes-commerces.page';

const routes: Routes = [
  {
    path: '',
    component: VillesCommercesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VillesCommercesPageRoutingModule {}
