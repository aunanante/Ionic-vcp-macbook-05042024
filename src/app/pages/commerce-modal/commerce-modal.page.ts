import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CommerceService } from 'src/app/services/commerce.service';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-commerce-modal',
  templateUrl: './commerce-modal.page.html',
  styleUrls: ['./commerce-modal.page.scss'],
})
export class CommerceModalPage implements OnInit {
  @Input() businessOwnerId!: string;
  commerceForm!: FormGroup;
  villes: any[] = [];
  filteredVilles: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private commerceService: CommerceService,
    private userService: UserService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.initForm(); 
    this.fetchVilles();
  }
 
  private initForm() {
    this.commerceForm = this.formBuilder.group({
      commercename: ['', Validators.required],
      services: ['', Validators.required],
      image_commerce: [''], // Optional field
      business_owner_id: [this.businessOwnerId, Validators.required], // Set default value to businessOwnerId
      ville_id: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.commerceForm.valid) {
      // Handle form submission
      const formData = this.commerceForm.value;
      console.log('Form Data:', formData);
      // You can send the form data to a service for further processing
    }
  }

  async cancel() {
    await this.modalController.dismiss({ dismissed: 'cancel' });
  }

  async confirm() {
    const formData = this.commerceForm.value;
    // Check if any required fields are missing
    if (
      !formData.commercename ||
      !formData.services ||
      !formData.ville_id ||
      (!formData.image_commerce && !(formData.image_commerce instanceof File))
    ) {
      // Construct alert message with missing fields named
      let alertMessage = 'Please fill in the following required fields:';
      if (!formData.commercename) alertMessage += `\n- Commerce Name`;
      if (!formData.services) alertMessage += `\n- Services`;
      if (!formData.ville_id) alertMessage += `\n- Ville`;
      if (
        !formData.image_commerce &&
        !(formData.image_commerce instanceof File)
      )
        alertMessage += `\n- Image`;

      // Alert specifying the missing fields
      alert(alertMessage);
    } else {
      // Proceed with form submission if all required fields are filled
      if (this.commerceForm.valid) {
        console.log('Form Data:', formData);
        try {
          // Upload the image
          const imageUrl = await this.userService.uploadImage(
            formData.image_commerce
          );

          if (!imageUrl) {
            console.error('Error uploading image or generating URL');
            await this.presentAlert(
              'Error',
              'Failed to upload image or generate URL'
            );
            return;
          } 

          // Update the form data with the image URL
          formData.image_commerce = imageUrl;
          console.log('formData.image_commerce', formData.image_commerce);

          console.log('formData', formData);

          const addedCommerce = await this.commerceService.addCommerce(
            formData
          );
          console.log('addedCommerce', addedCommerce);

          if (addedCommerce) {
            console.log('Commerce added successfully:', addedCommerce);
            // Display an alert to notify the user
            this.presentAlert('Success', 'Commerce added successfully');
            await this.modalController.dismiss({ dismissed: 'confirm', data: addedCommerce }); // Pass addedCommerce data
          } else {
            console.error('Failed to add commerce');
            await this.modalController.dismiss({ dismissed: 'error' }); // Dismiss with error role
          }
        } catch (error) {
          console.error('Error adding commerce :', error);
          // Handle error as needed
        }

        // Close the modal after saving changes
        this.modalController.dismiss();
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

  addPhoto(event: any) {
    // Handle image upload logic here
    const file = event.target.files[0];
    console.log('Selected File:', file);
    this.commerceForm.patchValue({
      image_commerce: file,
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
