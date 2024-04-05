import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule



import { IonicModule } from '@ionic/angular';

import { UpdateCategoryModalPageRoutingModule } from './update-category-modal-routing.module';

import { UpdateCategoryModalPage } from './update-category-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateCategoryModalPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [UpdateCategoryModalPage]
})
export class UpdateCategoryModalPageModule {}
