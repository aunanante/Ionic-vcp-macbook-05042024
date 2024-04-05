import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import { UserService } from 'src/app/services/user.service';
import { PaymentService } from 'src/app/services/payment.service';
import { AlertController, ModalController } from '@ionic/angular'; // Import ModalController
import { CreatePaymentPage } from '../create-payment/create-payment.page';
import { RenewPaymentPage } from '../renew-payment/renew-payment.page'; // Import RenewPaymentPage
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Import FormGroup, FormBuilder, and Validators

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  latestPayment: any; // Define a property to hold the latest payment information
  paymentForm!: FormGroup; // Define a FormGroup for the payment form
  daysRemaining: number = 0;

  constructor( 
    private userService: UserService,
    private paymentService: PaymentService,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.paymentForm = this.formBuilder.group({
      amount: ['', Validators.required],
      duration_months: ['', Validators.required],
      payment_date: [''],
      expiry_date: [''],
    });

    const businessOwnerId = await this.userService.getBusinessOwnerId();
    if (businessOwnerId) {
      const latestPayment = await this.paymentService.getLatestPayment(businessOwnerId);
      if (latestPayment) {
        this.latestPayment = latestPayment;
        this.updatePaymentForm(latestPayment);
      } else {
        console.error('No payment found for the business owner.');
      }
    } else {
      console.error('Business owner ID not found.');
    }

    this.calculateDaysRemaining();
  }

  updatePaymentForm(payment: any) {
    this.paymentForm.patchValue({
      amount: payment.amount,
      duration_months: payment.duration_months,
      payment_date: payment.payment_date,
      expiry_date: payment.expiry_date,
    });
  }

  async openCreatePaymentModal() {
    const modal = await this.modalController.create({
      component: CreatePaymentPage,
      componentProps: {},
    });
  
    modal.onDidDismiss().then((data) => {
      if (data.role === 'confirm' && data.data) {
        // If payment is confirmed and data is returned
        this.latestPayment = data.data; // Update latest payment with the returned data
        this.updatePaymentForm(data.data); // Update payment form
        this.calculateDaysRemaining(); // Recalculate days remaining
      }
    });
  
    return await modal.present();
  }  
 
  async openRenewPaymentModal() {
    if (this.latestPayment) {
      const currentDate = new Date();
      const expiryDate = new Date(this.latestPayment.expiry_date);

      if (currentDate > expiryDate) {
        try {
          const modal = await this.modalController.create({
            component: RenewPaymentPage,
            componentProps: {
              latestPayment: this.latestPayment,
            },
          });

          modal.onDidDismiss().then((data) => {
            if (data.role === 'confirm' && data.data) {
              this.latestPayment = data.data;
              this.updatePaymentForm(data.data);
              this.updateDaysRemaining();
            }
          });

          await modal.present();
        } catch (error) {
          console.error('Error opening renew payment modal:', error);
        }
      } else {
        this.presentAlert(
          'Payment Renewal Not Allowed',
          'You cannot renew your payment before the expiry date.'
        );
      }
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  calculateDaysRemaining() {
    if (this.latestPayment) {
      const expiryDate = new Date(this.latestPayment.expiry_date);
      const currentDate = new Date();
      const differenceInTime = expiryDate.getTime() - currentDate.getTime();
      this.daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    }
  }

  updateDaysRemaining() {
    this.calculateDaysRemaining();
    // Force Angular to detect changes and update the view
    this.cdRef.detectChanges();
  }
}
