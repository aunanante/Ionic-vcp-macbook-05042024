import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

import { IonicModule } from '@ionic/angular';

import { UpdateProductModalPageRoutingModule } from './update-product-modal-routing.module';

import { UpdateProductModalPage } from './update-product-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateProductModalPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [UpdateProductModalPage]
})
export class UpdateProductModalPageModule {}
