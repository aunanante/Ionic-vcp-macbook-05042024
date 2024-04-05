import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommercesPageRoutingModule } from './commerces-routing.module';

import { CommercesPage } from './commerces.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommercesPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [CommercesPage]
})
export class CommercesPageModule {}
