import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-update-business-owner-modal',
  templateUrl: './update-business-owner-modal.page.html',
  styleUrls: ['./update-business-owner-modal.page.scss'],
})
export class UpdateBusinessOwnerModalPage implements OnInit {
  businessOwnerForm!: FormGroup;
  myFile: File | null = null; // Variable to store the selected file

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertController: AlertController
  ) {
    this.route.queryParams.subscribe((params: { [key: string]: any }) => {
      this.businessOwnerForm = this.formBuilder.group({
        email: [{ value: params['email'], disabled: true }],
        name: [params['name'], Validators.required],
        adresse: [params['adresse']],
        telephone1: [params['telephone1']],
        telephone2: [params['telephone2']],
        image_owner: [params['image_owner']],
        monthly_fee_paid: [
          { value: params['monthly_fee_paid'], disabled: true },
        ],
      });
    });
  }

  onCancel() {
    this.router.navigate(['/dashboard/user']);
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}

  addPhoto(event: any) {
    const file = event.target.files[0];
    console.log('Selected File:', file);
    
    // Assign the URL of the selected file to the image_owner field
    const imageUrl = URL.createObjectURL(file);
    this.businessOwnerForm.patchValue({
      image_owner: imageUrl
    });
  
    // Store the file for later use in the onUpdate method
    this.myFile = file;
  }
  

  async onUpdate() {
    // Extract necessary fields from the form
    const { email, monthly_fee_paid, ...updatedFields } = this.businessOwnerForm.value;
  
    // Retrieve the current email from the query parameters
    const queryParams = await this.route.snapshot.queryParams;
    const currentEmail = queryParams['email'];
  
    // Fetch the existing business owner based on the current email
    const existingBusinessOwner = await this.userService.getBusinessOwnersByEmail(currentEmail);
  
    if (existingBusinessOwner.length === 0) {
      console.error('Business owner not found');
      return;
    }
  
    // Get the first (and only) existing business owner
    const originalBusinessOwner = existingBusinessOwner[0];

    // Check if a file has been selected
    if (this.myFile) {
      // Upload the file to the storage bucket
      const imageUrl = await this.userService.uploadImage(this.myFile);
      if (imageUrl) {
        // Update the image_owner field with the URL of the uploaded image
        updatedFields['image_owner'] = imageUrl;
      } else {
        // Handle error if upload fails
        console.error('Failed to upload image');
        const alert = await this.alertController.create({
          header: 'Upload Failed',
          message: 'Failed to upload image.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
    }
  
    // Check for updated fields
    const updatedFieldsKeys = Object.keys(updatedFields);
    const changedFields = updatedFieldsKeys.filter(key => originalBusinessOwner[key] !== updatedFields[key]);
  
    // If no fields have been updated, show alert and return
    if (changedFields.length === 0) {
      await this.showNoChangesAlert();
      return;
    }
  
    // Merge the updated fields with the existing business owner data
    const updatedBusinessOwner = { ...originalBusinessOwner, ...updatedFields };
  
    console.log('updatedBusinessOwner', updatedBusinessOwner);
    // Update the business owner
    const updated = await this.userService.updateBusinessOwner(updatedBusinessOwner);
  
    if (updated) {
      // Handle success
      console.log('Business owner updated successfully');
      await this.showSuccessAlert();
      this.router.navigate(['/dashboard/user']);
    } else {
      // Handle error
      console.error('Failed to update business owner');
      const alert = await this.alertController.create({
        header: 'Update Failed',
        message: 'Failed to update business owner.',
        buttons: ['OK']
      });
      await alert.present();
    }
  } 

  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Business owner updated successfully.',
      buttons: ['OK']
    });
    await alert.present();
  }
  
  async showNoChangesAlert() {
    const alert = await this.alertController.create({
      header: 'No Changes',
      message: 'No fields have been updated.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onDelete() {
    const email = this.businessOwnerForm.get('email')?.value;
    
    if (!email) {
      console.error('No email found for the current user');
      return;
    }
  
    const confirmAlert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this business owner?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete cancelled');
          }
        },
        { 
          text: 'Delete',
          handler: async () => {
            const deleted = await this.userService.deleteBusinessOwnerByEmail(email);
            if (deleted) {
              console.log('Business owner deleted successfully');
              await this.showDeleteSuccessAlert();
              // After successful deletion, navigate back to the user page
              this.router.navigate(['/dashboard/user']);
            } else {
              console.error('Failed to delete business owner');
              const errorAlert = await this.alertController.create({
                header: 'Deletion Failed',
                message: 'Failed to delete business owner.',
                buttons: ['OK']
              });
              await errorAlert.present();
            }
          }
        }
      ]
    });
  
    await confirmAlert.present();
  }
  
  async showDeleteSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Business owner deleted successfully.',
      buttons: ['OK']
    });
    await alert.present();
  }
  
  
}
