import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCategoryModalPageRoutingModule } from './create-category-modal-routing.module';

import { CreateCategoryModalPage } from './create-category-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateCategoryModalPageRoutingModule
  ],
  declarations: [CreateCategoryModalPage]
})
export class CreateCategoryModalPageModule {}
