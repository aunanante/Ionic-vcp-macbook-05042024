import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule


import { IonicModule } from '@ionic/angular';

import { UpdateCommerceModalPageRoutingModule } from './update-commerce-modal-routing.module';

import { UpdateCommerceModalPage } from './update-commerce-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateCommerceModalPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [UpdateCommerceModalPage]
})
export class UpdateCommerceModalPageModule {}
