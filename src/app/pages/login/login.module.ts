import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

import { UserService } from 'src/app/services/user.service';
import { IonicStorageModule } from '@ionic/storage-angular';
 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot() // Initialize Ionic Storage
  ],
  declarations: [LoginPage],
  providers: [UserService] 
})
export class LoginPageModule {}
