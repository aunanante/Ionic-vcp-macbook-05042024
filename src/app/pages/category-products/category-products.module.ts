import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryProductsPageRoutingModule } from './category-products-routing.module';

import { CategoryProductsPage } from './category-products.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryProductsPageRoutingModule
  ],
  declarations: [CategoryProductsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoryProductsPageModule {}
