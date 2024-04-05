import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { UserPageRoutingModule } from './user-routing.module';

import { UserPage } from './user.page';
import { UserService } from 'src/app/services/user.service';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    IonicModule,
    UserPageRoutingModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot() // Initialize Ionic Storage
  ],
  declarations: [UserPage],
  providers: [UserService] 
})
export class UserPageModule {}
