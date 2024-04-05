import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePaymentPageRoutingModule } from './create-payment-routing.module';

import { CreatePaymentPage } from './create-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePaymentPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [CreatePaymentPage]
})
export class CreatePaymentPageModule {}
