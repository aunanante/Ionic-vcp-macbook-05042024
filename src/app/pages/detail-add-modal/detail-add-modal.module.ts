import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailAddModalPageRoutingModule } from './detail-add-modal-routing.module';

import { DetailAddModalPage } from './detail-add-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailAddModalPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DetailAddModalPage]
})
export class DetailAddModalPageModule {}
