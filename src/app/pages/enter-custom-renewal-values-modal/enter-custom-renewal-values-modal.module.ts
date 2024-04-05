import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnterCustomRenewalValuesModalPageRoutingModule } from './enter-custom-renewal-values-modal-routing.module';

import { EnterCustomRenewalValuesModalPage } from './enter-custom-renewal-values-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnterCustomRenewalValuesModalPageRoutingModule
  ],
  declarations: [EnterCustomRenewalValuesModalPage]
})
export class EnterCustomRenewalValuesModalPageModule {}
