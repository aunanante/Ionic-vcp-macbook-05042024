import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CommerceService } from 'src/app/services/commerce.service';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-update-commerce-modal',
  templateUrl: './update-commerce-modal.page.html',
  styleUrls: ['./update-commerce-modal.page.scss'],
})
export class UpdateCommerceModalPage implements OnInit {

  @Input() commerce: any; // Define input property
  commerceForm!: FormGroup; // Define the form group
  myFile: File | null = null;
  villes: any[] = [];
  filteredVilles: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private commerceService: CommerceService,
    private userService: UserService,
    private alertController: AlertController,
  ) { }
 
  ngOnInit() {
    // Initialize the form with received props
    this.commerceForm = this.formBuilder.group({
      business_owner_id: [this.commerce.business_owner_id, Validators.required],
      commercename: [this.commerce.commercename, Validators.required],
      id: [this.commerce.id],
      image_commerce: [this.commerce.image_commerce],
      services: [this.commerce.services, Validators.required],
      ville_id: [this.commerce.ville_id],
    });
    this.fetchVilles();
  } 

  onCancel() {
    this.modalController.dismiss({ dismissed: 'cancel' });
  }

  async onUpdate() {
    try {
      if (this.commerceForm.valid) {
        const formData = this.commerceForm.value;
  
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
              formData.image_commerce = imageUrl;
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
  
          // Update the commerce data
          const success = await this.commerceService.updateCommerce(formData);
  
          if (success) {
            console.log('Commerce updated successfully');
            // Dismiss the modal and pass any necessary data back to the parent component
            this.modalController.dismiss({ dismissed: 'confirm', updated: true });
          } else {
            console.error('Failed to update commerce');
            // Handle the failure scenario as needed 
          }
        } else {
          // Alert user that no fields have been modified
          alert('No fields have been modified. Please modify at least one field to update.');
        }
      } else {
        console.error('Form is invalid');
        // Handle the case where the form is not valid
      }
    } catch (error) {
      console.error('Error updating commerce:', error);
      // Handle the error scenario as needed
    }
  }

  isFormModified(formData: any): boolean {
    // Compare form values with original commerce data
    return Object.keys(formData).some(key => formData[key] !== this.commerce[key]);
  }
  

  addPhoto(event: any) {
    const file = event.target.files[0];
    console.log('Selected File:', file);
    
    // Assign the URL of the selected file to the image_owner field
    const imageUrl = URL.createObjectURL(file);
    this.commerceForm.patchValue({
      image_commerce: imageUrl
    });
  
    // Store the file for later use in the onUpdate method
    this.myFile = file;
  }
  
  async onDelete() {
    try {
      const commerceId = this.commerce.id; // Get the ID of the commerce to delete
      const confirmed = await this.confirmDelete(); // Ask for confirmation before deleting
  
      if (confirmed) {
        const success = await this.commerceService.deleteCommerce(commerceId);
  
        if (success) {
          console.log('Commerce deleted successfully');
          // Dismiss the modal and pass any necessary data back to the parent component
          // this.modalController.dismiss({ dismissed: 'confirm', deleted: true });
          this.modalController.dismiss({ dismissed: 'confirm', deletedCommerceId: this.commerce.id });
        } else {
          console.error('Failed to delete commerce');
          // Handle the failure scenario as needed 
        }
      }
    } catch (error) {
      console.error('Error deleting commerce:', error);
      // Handle the error scenario as needed
    }
  }
  
  async confirmDelete(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this commerce?',
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

  async fetchVilles() {
    try {
      this.villes = await this.commerceService.getAllVilles();
    } catch (error) {
      console.error('Error fetching villes:', error);
    }
  }

  filterVilles(searchTerm: string) {
    this.filteredVilles = this.villes.filter((ville) =>
      ville.villename.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  selectVille(ville: any) {
    this.commerceForm.patchValue({
      ville_id: ville.id,
    });
  }

}
