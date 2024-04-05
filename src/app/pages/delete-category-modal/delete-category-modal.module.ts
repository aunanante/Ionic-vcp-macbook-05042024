import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteCategoryModalPageRoutingModule } from './delete-category-modal-routing.module';

import { DeleteCategoryModalPage } from './delete-category-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeleteCategoryModalPageRoutingModule
  ],
  declarations: [DeleteCategoryModalPage]
})
export class DeleteCategoryModalPageModule {}
