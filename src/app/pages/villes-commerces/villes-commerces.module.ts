import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VillesCommercesPageRoutingModule } from './villes-commerces-routing.module';

import { VillesCommercesPage } from './villes-commerces.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VillesCommercesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [VillesCommercesPage]
})
export class VillesCommercesPageModule {}
