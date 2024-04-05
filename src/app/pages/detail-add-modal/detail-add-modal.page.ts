import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { DetailService } from 'src/app/services/detail.service';

@Component({
  selector: 'app-detail-add-modal',
  templateUrl: './detail-add-modal.page.html',
  styleUrls: ['./detail-add-modal.page.scss'],
})
export class DetailAddModalPage implements OnInit {

  @Input() product: any;
  detailForm!: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertController: AlertController,
    private detailService: DetailService,
  ) { }

  ngOnInit() {
    // Initialize the detailForm
    this.detailForm = this.formBuilder.group({
      detailname: ['', Validators.required],
      description: [''],
      image_detail: ['', Validators.required],
      business_owner_id: [this.product?.business_owner_id || '', Validators.required],
      ville_id: [this.product?.ville_id || ''],
      commerce_id: [this.product?.commerce_id || ''],
      category_id: [this.product?.category_id || ''],
      product_id: [this.product?.id || '', Validators.required],
    });
    
    console.log('Product props:', this.product);
  }

  addPhoto(event: any) {
    // Handle image upload logic here
    const file = event.target.files[0];
    console.log('Selected File:', file);
    this.detailForm.patchValue({
      image_detail: file,
    });
  }

  async onCancel() {
    await this.modalController.dismiss({ dismissed: 'cancel' });
  }

  async onConfirm() {
    const formData = this.detailForm.value;

    // Check if all required fields are filled
    if (
      !formData.detailname ||
      !formData.image_detail ||
      !(formData.image_detail instanceof File)
    ) {
      // Construct alert message with missing fields named
      let alertMessage = 'Please fill in the following required fields:';
      if (!formData.detailname) alertMessage += `\n- Detail Name`;
      if (!formData.image_detail) alertMessage += `\n- Image Detail`;
    
      // Alert specifying the missing fields
      alert(alertMessage);
    } else {
      if (this.detailForm.valid) {
        try {
          // Upload the image
          const imageUrl = await this.userService.uploadImage(
            formData.image_detail
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
          formData.image_detail = imageUrl;

          // Add the detail using the detailService
          const addedDetail = await this.detailService.addDetail(formData);

          if (addedDetail) {
            console.log('Detail added successfully:', addedDetail);
            // Display an alert to notify the user
            this.presentAlert('Success', 'Detail added successfully');
            await this.modalController.dismiss({ dismissed: 'confirm', data: addedDetail }); // Pass addedDetail data
          } else {
            console.error('Failed to add detail');
            await this.modalController.dismiss({ dismissed: 'error' }); // Dismiss with error role
          }

        } catch (error) {
          console.error('Error adding detail:', error);
        }
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
}
