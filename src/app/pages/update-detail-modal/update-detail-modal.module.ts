import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

import { IonicModule } from '@ionic/angular';

import { UpdateDetailModalPageRoutingModule } from './update-detail-modal-routing.module';

import { UpdateDetailModalPage } from './update-detail-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateDetailModalPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [UpdateDetailModalPage]
})
export class UpdateDetailModalPageModule {}
