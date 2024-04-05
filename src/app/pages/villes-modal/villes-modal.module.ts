import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VillesModalPageRoutingModule } from './villes-modal-routing.module';

import { VillesModalPage } from './villes-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VillesModalPageRoutingModule
  ],
  declarations: [VillesModalPage]
})
export class VillesModalPageModule {}
