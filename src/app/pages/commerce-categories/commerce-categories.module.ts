import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { CommerceCategoriesPageRoutingModule } from './commerce-categories-routing.module';

import { CommerceCategoriesPage } from './commerce-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommerceCategoriesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CommerceCategoriesPage]
})
export class CommerceCategoriesPageModule {}
