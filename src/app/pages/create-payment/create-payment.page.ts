import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { PaymentService } from 'src/app/services/payment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.page.html',
  styleUrls: ['./create-payment.page.scss'],
})
export class CreatePaymentPage implements OnInit {
  paymentForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,
    private paymentService: PaymentService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.initForm();
    this.subscribeToFormChanges();
  }

  initForm() {
    const today = new Date();
    const expiryDate = new Date(today);
    
    // Set the time part of the expiry date to match the payment date
    expiryDate.setHours(today.getHours());
    expiryDate.setMinutes(today.getMinutes());
    expiryDate.setSeconds(today.getSeconds());
  
    expiryDate.setDate(expiryDate.getDate() + 3); // Default expiry date is 3 days from today
  
    this.paymentForm = this.formBuilder.group({
      amount: [0.1, Validators.required],
      duration_months: ['0.1', Validators.required], // Set the default value to '0.1'
      payment_date: [{ value: today.toISOString(), disabled: false }],
      expiry_date: [
        { value: expiryDate.toISOString(), disabled: false },
      ],
    });
  }
  

  async cancel() {
    // Handle cancel button click, e.g., navigate back
    console.log('Payment creation canceled');
    await this.modalController.dismiss(null, 'cancel'); // Dismiss with a 'cancel' role
  }

  async subscribeToFormChanges() {
    const durationMonthsControl = this.paymentForm.get('duration_months');
    if (durationMonthsControl) {
      const valueChanges = durationMonthsControl.valueChanges.toPromise();
      await valueChanges;
      this.updateAmountAndExpiryDate();
    }
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
  
  async confirm() {
    if (this.paymentForm.valid) {
      const paymentData = this.paymentForm.value;
      await this.presentConfirmationAlert(paymentData); // Display confirmation alert
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
          // Step 2: Insert  a record in the business_owners_payments table
          await this.paymentService.createBusinessOwnersPayments(businessOwnerId, paymentId);
  
          // Step 3: Create access control
          await this.paymentService.createAccessControl(businessOwnerId);
  
          // Step 4: Update business owners
          await this.paymentService.updateBusinessOwners(businessOwnerId);
  
          console.log('Payment confirmed:', paymentDataWithNumericDuration);
          await this.modalController.dismiss(paymentDataWithNumericDuration, 'confirm'); // Dismiss with a 'confirm' role
  
          // Alert for successful payment
          this.presentAlerte('Payment successful');
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
