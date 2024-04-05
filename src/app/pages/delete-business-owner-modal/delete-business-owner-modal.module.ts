import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteBusinessOwnerModalPageRoutingModule } from './delete-business-owner-modal-routing.module';

import { DeleteBusinessOwnerModalPage } from './delete-business-owner-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeleteBusinessOwnerModalPageRoutingModule
  ],
  declarations: [DeleteBusinessOwnerModalPage]
})
export class DeleteBusinessOwnerModalPageModule {}
