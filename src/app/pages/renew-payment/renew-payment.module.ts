import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RenewPaymentPageRoutingModule } from './renew-payment-routing.module';

import { RenewPaymentPage } from './renew-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RenewPaymentPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RenewPaymentPage]
})
export class RenewPaymentPageModule {}
