import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteDetailModalPageRoutingModule } from './delete-detail-modal-routing.module';

import { DeleteDetailModalPage } from './delete-detail-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeleteDetailModalPageRoutingModule
  ],
  declarations: [DeleteDetailModalPage]
})
export class DeleteDetailModalPageModule {}
