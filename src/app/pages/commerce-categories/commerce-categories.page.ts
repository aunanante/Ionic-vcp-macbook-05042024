import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-commerce-categories',
  templateUrl: './commerce-categories.page.html',
  styleUrls: ['./commerce-categories.page.scss'],
})
export class CommerceCategoriesPage implements OnInit {
  @Input() business_owner_id!: string;
  @Input() ville_id!: number;
  @Input() commerce_id!: number;

  categoryForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,
    private userService: UserService,
    private categoryService: CategoryService
  ) {}

  private initForm() {
    this.categoryForm = this.formBuilder.group({
      categoryname: ['', Validators.required],
      image_category: [''],
      commerce_id: [this.commerce_id, Validators.required],
      business_owner_id: [this.business_owner_id, Validators.required],
      ville_id: [this.ville_id, Validators.required],
    });
  } 

  ngOnInit() {
    this.initForm();
    console.log(
      'Received props:',
      this.business_owner_id,
      this.ville_id,
      this.commerce_id
    );
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      // Logic to handle form submission and update category details
    } else {
      // Handle form validation errors
    }
  }

  addPhoto(event: any) {
    // Handle image upload logic here
    const file = event.target.files[0];
    console.log('Selected File:', file);
    this.categoryForm.patchValue({
      image_category: file,
    });
  }

  async onCancel() {
    await this.modalController.dismiss({ dismissed: 'cancel' });
  }

  async onConfirm() { 
    const formData = this.categoryForm.value;

    if (
      !formData.categoryname ||
      (!formData.image_category && !(formData.image_category instanceof File))
    ) {
      // Construct alert message with missing fields named
      let alertMessage = 'Please fill in the following required fields:';
      if (!formData.categoryname) alertMessage += `\n- Category Name`;
      if (
        !formData.image_category &&
        !(formData.image_category instanceof File)
      )
        alertMessage += `\n- Image`;

      // Alert specifying the missing fields
      alert(alertMessage);
    } else {
      if (this.categoryForm.valid) {
        // console.log('Form Data:', formData);
        try {
          // Upload the image
          const imageUrl = await this.userService.uploadImage(
            formData.image_category
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
          formData.image_category = imageUrl;
          console.log('formData.image_category', formData.image_category);
          console.log('formData', formData);

          const addedCategory = await this.categoryService.addCategory(
            formData
          ); 
          
          if (addedCategory) {
            console.log('Category added successfully:', addedCategory);
            // Display an alert to notify the user
            this.presentAlert('Success', 'Category added successfully');
            await this.modalController.dismiss({ dismissed: 'confirm', data: addedCategory }); // Pass addedCategory data
          } else {
            console.error('Failed to add category');
            await this.modalController.dismiss({ dismissed: 'error' }); // Dismiss with error role
          }

        } catch (error) {
          console.error('Error adding category :', error);
          // Handle error as needed
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
