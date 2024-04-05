import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductModalAddPageRoutingModule } from './product-modal-add-routing.module';

import { ProductModalAddPage } from './product-modal-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductModalAddPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ProductModalAddPage]
})
export class ProductModalAddPageModule {}
