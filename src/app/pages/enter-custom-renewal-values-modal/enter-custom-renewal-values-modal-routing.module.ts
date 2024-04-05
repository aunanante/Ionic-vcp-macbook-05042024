import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnterCustomRenewalValuesModalPage } from './enter-custom-renewal-values-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EnterCustomRenewalValuesModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterCustomRenewalValuesModalPageRoutingModule {}
