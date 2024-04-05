import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-business-owner-modal',
  templateUrl: './business-owner-modal.page.html',
  styleUrls: ['./business-owner-modal.page.scss'],
})
export class BusinessOwnerModalPage implements OnInit {
  @Input() email: string | null = null;
  @Input() monthly_fee_paid: boolean = false;

  businessOwnerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Initialize the form
    this.businessOwnerForm = this.formBuilder.group({
      email: [{ value: this.email, disabled: true }],
      name: [''],
      image_owner: [''],
      adresse: [''],
      telephone1: [''],
      telephone2: [''],
      monthly_fee_paid: [{ value: this.monthly_fee_paid, disabled: true }],
    });
  }

  async onSubmit() {
    // Handle form submission here
    const formData = {
      ...this.businessOwnerForm.value, // Get values from form fields
      email: this.email, // Use the component input for email
      monthly_fee_paid: this.monthly_fee_paid, // Use the component input for monthly_fee_paid
    };

    // Check if the name field is null
    if (!formData.name) {
      console.error('Error: Name field cannot be null');
      await this.presentAlert('Error', 'Name field cannot be null');
      return; // Prevent form submission
    }
 
    try {
      // Upload the image
      const imageUrl = await this.userService.uploadImage(formData.image_owner);

      if (!imageUrl) {
        console.error('Error uploading image or generating URL');
        await this.presentAlert(
          'Error',
          'Failed to upload image or generate URL'
        );
        return;
      }

      // Update the form data with the image URL
      formData.image_owner = imageUrl;
      console.log('formData.image_owner', formData.image_owner);

      const addedOwner = await this.userService.addBusinessOwner(formData);
      console.log('addedOwner', addedOwner);

      if (addedOwner) {
        console.log('Business owner added successfully:', addedOwner);
        // Display an alert to notify the user
        this.presentAlert('Success', 'Business owner added successfully');
        await this.modalController.dismiss(addedOwner); // Pass addedOwner data
      } else {
        console.error('Failed to add business owner');
        await this.modalController.dismiss(addedOwner); // Pass addedOwner data
      }
    } catch (error) {
      console.error('Error adding business owner:', error);
      // Handle error as needed
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

  onCancel() {
    // Dismiss the modal when cancel button is clicked
    this.modalController.dismiss();
  }

  addPhoto(event: any) {
    // Handle image upload logic here
    const file = event.target.files[0];
    console.log('Selected File:', file);
    this.businessOwnerForm.patchValue({
      image_owner: file, 
    });
  }

} 
