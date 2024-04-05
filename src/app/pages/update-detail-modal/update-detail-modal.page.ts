import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { DetailService } from 'src/app/services/detail.service';

@Component({
  selector: 'app-update-detail-modal',
  templateUrl: './update-detail-modal.page.html',
  styleUrls: ['./update-detail-modal.page.scss'],
})
export class UpdateDetailModalPage implements OnInit {
  @Input() detail: any;
  myFile: File | null = null;
  detailForm!: FormGroup;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private detailService: DetailService
  ) { }

  ngOnInit() {
    // Initialize the form
    this.detailForm = this.formBuilder.group({
      business_owner_id: [this.detail.business_owner_id || ''],
      category_id: [this.detail.category_id || ''],
      commerce_id: [this.detail.commerce_id || ''],
      created_at: [this.detail.created_at || ''],
      description: [this.detail.description || ''],
      detailname: [this.detail.detailname || ''],
      id: [this.detail.id || ''],
      image_detail: [this.detail.image_detail || ''],
      product_id: [this.detail.product_id || ''],
      ville_id: [this.detail.ville_id || ''],
    });
  }

  addPhoto(event: any) {
    const file = event.target.files[0];
    console.log('Selected File:', file);

    // Assign the URL of the selected file to the image_owner field
    const imageUrl = URL.createObjectURL(file);
    this.detailForm.patchValue({
      image_detail: imageUrl,
    });

    // Store the file for later use in the onUpdate method
    this.myFile = file;
  }

  async onCancel() {
    this.modalController.dismiss({ dismissed: 'cancel' });
  }
 
  async onUpdate() {
    try {
      if (this.detailForm.valid) {
        const formData = this.detailForm.value;
        // Check if any field has been modified
        const isModified = this.isFormModified(formData);

        if (isModified) {
          console.log('formData', formData);

          // Check if a file has been selected
          if (this.myFile) {
            // Upload the file to the storage bucket
            const imageUrl = await this.userService.uploadImage(this.myFile);
            if (imageUrl) {
              // Update the image_commerce field with the URL of the uploaded image
              formData.image_detail = imageUrl;
            } else {
              // Handle error if upload fails
              console.error('Failed to upload image');
              const alert = await this.alertController.create({
                header: 'Upload Failed',
                message: 'Failed to upload image.',
                buttons: ['OK'],
              });
              await alert.present();
              return;
            }
          }

          // Call the updateproduct method to update the product
          const detailId = this.detail.id;
          const updated = await this.detailService.updateDetail(
            detailId,
            formData
          );
          if (updated) {
            // Handle success scenario
            console.log('detail updated successfully');
            // Dismiss the modal and pass any necessary data back to the parent component
            this.modalController.dismiss({ dismissed: 'confirm', updated: true });
          } else {
            // Handle failure scenario
            console.error('Failed to update detail');
            // Display an error message
            const alert = await this.alertController.create({
              header: 'Update Failed',
              message: 'Failed to update detail.',
              buttons: ['OK'],
            });
            await alert.present();
          }
        } else {
          // Alert user that no fields have been modified
          alert(
            'No fields have been modified. Please modify at least one field to update.'
          );
        }
      } else {
        console.error('Form is invalid');
        // Handle the case where the form is not valid
      }
    } catch (error) {
      console.error('Error updating detail:', error);
      // Handle the error scenario as needed
    }
  }

  isFormModified(formData: any): boolean {
    // Compare form values with original commerce data
    return Object.keys(formData).some(
      (key) => formData[key] !== this.detail[key]
    );
  }

  async onDelete() {
    try {
      const detailId = this.detail.id; // Get the ID of the detail to delete
      const confirmed = await this.confirmDelete(); // Ask for confirmation before deleting
  
      if (confirmed) {
        const success = await this.detailService.deleteDetail(detailId);
  
        if (success) {
          console.log('Detail deleted successfully');
          // Dismiss the modal and pass any necessary data back to the parent component
          // this.modalController.dismiss({ dismissed: 'confirm', deleted: true });
          this.modalController.dismiss({ dismissed: 'confirm', deletedDetailId: this.detail.id });
        } else {
          console.error('Failed to delete detail');
          // Handle the failure scenario as needed 
        }
      }
    } catch (error) {
      console.error('Error deleting detail:', error);
      // Handle the error scenario as needed
    }
  }

  async confirmDelete(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this product?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              resolve(false); // Resolve with false if deletion is canceled
            }
          },
          {
            text: 'Delete',
            handler: () => {
              resolve(true); // Resolve with true if deletion is confirmed
            }
          }
        ]
      });
  
      await alert.present();
    });
  }  
  

}
