import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { LoadingController, AlertController } from '@ionic/angular'
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  credentials = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    // private router: Router,
    private userService: UserService,
  ) {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        
        // this.router.navigateByUrl('/app/user', { replaceUrl: true });
      }
    })
  }

  ngOnInit() {
  }

  goBackToVillesCommerces() {
    // You can use navCtrl or router based on your preference
    // Using NavController:
    this.navCtrl.navigateBack('/villes-commerces');

    // Using Router:
    // this.router.navigate(['/villes-commerces']);
  }
 
  get email() {
    return this.credentials.controls.email
  }

  get password() {
    return this.credentials.controls.password
  }

  async login() {
    const loading = await this.loadingController.create()
    await loading.present()

    this.authService.signIn(this.credentials.getRawValue()).then(async (data) => {
      await loading.dismiss()

      if (data.error) {
        this.showAlert('Login failed', data.error.message)
      } else {
        
        // Store the email in the UserService
        const email = this.credentials.controls.email.value;
        try {
          await this.userService.setCurrentUserEmail(email);
          console.log('User email set successfully.');
        } catch (error) {
          console.error('Error setting user email:', error);
        }

        // Navigate to the dashboard
        this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      }
    })
  }

  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    })
    await alert.present()
  }

  async forgotPw() {
    const alert = await this.alertController.create({
      header: "Receive a new password",
      message: "Please insert your email",
      inputs: [
        {
          type: "email",
          name: "email",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Reset password",
          handler: async (result) => {
            const loading = await this.loadingController.create();
            await loading.present();
            const { data, error } = await this.authService.sendPwReset(
              result.email
            );
            await loading.dismiss();

            if (error) {
              this.showAlert("Failed", error.message);
            } else {
              this.showAlert(
                "Success",
                "Please check your emails for further instructions!"
              );
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async getMagicLink() {
    const alert = await this.alertController.create({
      header: "Get a Magic Link",
      message: "We will send you a link to magically log in!",
      inputs: [
        {
          type: "email",
          name: "email",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Get Magic Link",
          handler: async (result) => {
            const loading = await this.loadingController.create();
            await loading.present();
            const { data, error } = await this.authService.signInWithEmail(
              result.email
            );
            await loading.dismiss();

            if (error) {
              this.showAlert("Failed", error.message);
            } else {
              this.showAlert(
                "Success",
                "Please check your emails for further instructions!"
              );
            }
          },
        },
      ],
    });
    await alert.present();
  }

}
