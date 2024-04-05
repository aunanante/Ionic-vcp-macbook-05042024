import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-modal-add',
  templateUrl: './product-modal-add.page.html',
  styleUrls: ['./product-modal-add.page.scss'],
})
export class ProductModalAddPage implements OnInit {

  @Input() category: any;
  productForm!: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertController: AlertController,
    private productService: ProductService,
  ) { }

  ngOnInit() {
    console.log('Category props:', this.category);
    // Initialize the reactive form with form controls
    this.productForm = this.formBuilder.group({
      productname: ['', Validators.required],
      reference: [''],
      price: ['', Validators.required],
      description: [''],
      image_product: [''], // You may want to add validation for image upload
      business_owner_id: [this.category.business_owner_id],
      ville_id: [this.category.ville_id],
      commerce_id: [this.category.commerce_id],
      category_id: [this.category.id] // Assuming the category object has an 'id' property
    }); 
  }

  addPhoto(event: any) {
    // Handle image upload logic here
    const file = event.target.files[0];
    console.log('Selected File:', file);
    this.productForm.patchValue({
      image_product: file,
    });
  }

  async onCancel() {
    await this.modalController.dismiss({ dismissed: 'cancel' });
  }

  async onConfirm() {
    const formData = this.productForm.value;
    if (
      !formData.productname ||
      !formData.reference ||
      (!formData.image_product && !(formData.image_product instanceof File)) ||
      !formData.price ||
      !formData.description
    ) {
      // Construct alert message with missing fields named
      let alertMessage = 'Please fill in the following required fields:';
      if (!formData.productname) alertMessage += `\n- Product Name`;
      if (!formData.reference) alertMessage += `\n- Reference`;
      if (!formData.image_product && !(formData.image_product instanceof File)) alertMessage += `\n- Image`;
      if (!formData.price) alertMessage += `\n- Price`;
      if (!formData.description) alertMessage += `\n- Description`;
    
      // Alert specifying the missing fields
      alert(alertMessage);
    } else {
      if (this.productForm.valid) {
        try {
          // Upload the image
          const imageUrl = await this.userService.uploadImage(
            formData.image_product
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
          formData.image_product = imageUrl;
          console.log('formData.image_product', formData.image_product);
          console.log('formData', formData);

          const addedProduct = await this.productService.addProduct(
            formData
          ); 

          if (addedProduct) {
            console.log('Product added successfully:', addedProduct);
            // Display an alert to notify the user
            this.presentAlert('Success', 'Product added successfully');
            await this.modalController.dismiss({ dismissed: 'confirm', data: addedProduct }); // Pass addedCategory data
          } else {
            console.error('Failed to add category');
            await this.modalController.dismiss({ dismissed: 'error' }); // Dismiss with error role
          }

        } catch (error) {
          console.error('Error adding product :', error);
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
