import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { PaymentService } from 'src/app/services/payment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-renew-payment',
  templateUrl: './renew-payment.page.html',
  styleUrls: ['./renew-payment.page.scss'],
})
export class RenewPaymentPage implements OnInit {

  @Input() latestPayment: any;
  paymentForm!: FormGroup;

  durationOptions = [
    { label: '0.1', value: 0.1 },
    { label: '0.5', value: 0.5 },
    { label: '1', value: 1 },
    { label: '3', value: 3 },
    { label: '6', value: 6 },
    { label: '9', value: 9 },
    { label: '12', value: 12 }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,
    private paymentService: PaymentService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.initializeForm();
    console.log('latest Payment : ', this.latestPayment);
  }

 /*  private initializeForm() {
    this.paymentForm = this.formBuilder.group({
      amount: [this.latestPayment.amount, Validators.required],
      duration_months: [this.latestPayment.duration_months, Validators.required],
      payment_date: [this.latestPayment.payment_date],
      expiry_date: [this.latestPayment.expiry_date]
    });
  } */

  private initializeForm() {
    const today = new Date();
    const expiryDate = this.calculateExpiryDate(today, this.latestPayment.duration_months);

    this.paymentForm = this.formBuilder.group({
      amount: [this.latestPayment.amount, Validators.required],
      duration_months: [this.latestPayment.duration_months, Validators.required],
      payment_date: [today.toISOString()],
      expiry_date: [expiryDate.toISOString()]
    });
  }

  calculateExpiryDate(startDate: Date, durationMonths: number): Date {
    const expiryDate = new Date(startDate);
  
    // Calculate expiry date based on duration months
    if (durationMonths <= 0.1) {
      expiryDate.setDate(startDate.getDate() + 3); // 3 days for 0.1 month
    } else if (durationMonths === 0.5) {
      expiryDate.setDate(startDate.getDate() + 15); // 15 days for 0.5 month
    } else {
      expiryDate.setMonth(startDate.getMonth() + Math.floor(durationMonths)); // Whole months for other durations
    }
  
    // Set the time part of the expiry date to match the start date
    expiryDate.setHours(startDate.getHours());
    expiryDate.setMinutes(startDate.getMinutes());
    expiryDate.setSeconds(startDate.getSeconds());

    return expiryDate;
  }

  updateAmountAndExpiryDate() {
    const durationMonthsControl = this.paymentForm.get('duration_months');
    if (durationMonthsControl) {
      const today = new Date();
      const durationMonths = parseFloat(durationMonthsControl.value);
      const expiryDate = new Date(today);
  
      // Calculate expiry date based on duration months
      if (durationMonths <= 0.1) {
        expiryDate.setDate(today.getDate() + 3); // 3 days for 0.1 month
      } else if (durationMonths === 0.5) {
        expiryDate.setDate(today.getDate() + 15); // 15 days for 0.5 month
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + Math.floor(durationMonths)); // Whole months for other durations
      }
  
      // Set the time part of the expiry date to match the payment date
      expiryDate.setHours(today.getHours());
      expiryDate.setMinutes(today.getMinutes());
      expiryDate.setSeconds(today.getSeconds());
  
      const expiryDateISO = expiryDate.toISOString(); // Get ISO string including time
  
      const expiryDateControl = this.paymentForm.get('expiry_date');
      if (expiryDateControl) {
        expiryDateControl.setValue(expiryDateISO);
      }
  
      // Calculate amount based on duration months
      let amount;
      if (durationMonths <= 0.1) {
        amount = 0.1;
      } else if (durationMonths === 0.5) {
        amount = 0.5;
      } else {
        amount = Math.floor(durationMonths);
      }
  
      const amountControl = this.paymentForm.get('amount');
      if (amountControl) {
        amountControl.setValue(amount);
      }
  
      // Log the values of all fields
      console.log('Amount:', amountControl ? amountControl.value : null);
      console.log('Duration Months:', durationMonths);
      console.log('Payment Date:', today);
      console.log('Expiry Date:', expiryDateControl ? expiryDateControl.value : null);
    }
  }

  cancel() {
    // Dismiss the modal without any data
    this.modalController.dismiss();
  }

  renew() {
    if (this.paymentForm.valid) {
      const paymentData = this.paymentForm.value;
      this.presentConfirmationAlert(paymentData); // Display confirmation alert
    } else {
      console.error('Payment form is invalid');
    }
  }

  async presentConfirmationAlert(paymentData: any): Promise<void> {
    // console.log('Presenting confirmation alert');
    const alert = await this.alertController.create({
      header: 'Confirm Payment',
      message: `
            Amount: ${paymentData.amount}\n
            Duration (months): ${paymentData.duration_months}\n
            Payment Date: ${paymentData.payment_date}\n
            Expiry Date: ${paymentData.expiry_date}\n
        `,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel button clicked');
          },
        },
        {
          text: 'OK',
          handler: async () => {
            console.log('OK button clicked');
            await this.postPayment(paymentData);
          },
        },
      ],
    });

    // console.log('Alert created');
    await alert.present();
    // console.log('Alert presented');
  }

  async postPayment(paymentData: any): Promise<void> {
    try {
      // Convert duration_months to a numeric value
      const durationMonthsNumeric = parseFloat(paymentData.duration_months);
  
      // Update paymentData with the converted value
      const paymentDataWithNumericDuration = {
        ...paymentData,
        duration_months: durationMonthsNumeric,
      };
   
      // Step 1: Insert payment data into the payments table
      const paymentId = await this.paymentService.makePayment(paymentDataWithNumericDuration);
  
      if (paymentId) {
        
        const businessOwnerId = await this.userService.getBusinessOwnerId();
        if (businessOwnerId) {
          // Step 2: update the business_owners_payments table
          await this.paymentService.updateBusinessOwnersPayments(businessOwnerId, paymentId);

          // Step 3: update access control
          await this.paymentService.updateAccessControl(businessOwnerId);

          // Step 4: Update business owners
          await this.paymentService.updateBusinessOwners(businessOwnerId);

          console.log('Renewal confirmed:', paymentDataWithNumericDuration);
          await this.modalController.dismiss(paymentDataWithNumericDuration, 'confirm'); // Dismiss with a 'confirm' role
  
          // Alert for successful payment
          this.presentAlerte('Renewal successful');
        } else {
          console.error('Business owner ID not found.');
        } 
      } else {
        console.error('Error making payment.');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  }
  
  async presentAlerte(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Success',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  

  async presentAlert(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

}
