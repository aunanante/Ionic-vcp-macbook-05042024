import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenewPaymentPage } from './renew-payment.page';

const routes: Routes = [
  {
    path: '',
    component: RenewPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenewPaymentPageRoutingModule {}
