import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteProductModalPageRoutingModule } from './delete-product-modal-routing.module';

import { DeleteProductModalPage } from './delete-product-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeleteProductModalPageRoutingModule
  ],
  declarations: [DeleteProductModalPage]
})
export class DeleteProductModalPageModule {}
