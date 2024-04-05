import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-update-category-modal',
  templateUrl: './update-category-modal.page.html',
  styleUrls: ['./update-category-modal.page.scss'],
})
export class UpdateCategoryModalPage implements OnInit {
  @Input() category: any;
  categoryForm!: FormGroup;
  myFile: File | null = null;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    console.log('Props received:', this.category);

    // Initialize the form with the props received
    this.categoryForm = this.formBuilder.group({
      categoryname: [this.category.categoryname, Validators.required],
      image_category: [this.category.image_category, Validators.required],
      // Add other form controls as needed
    });
  }

  addPhoto(event: any) {
    const file = event.target.files[0];
    console.log('Selected File:', file);

    // Assign the URL of the selected file to the image_owner field
    const imageUrl = URL.createObjectURL(file);
    this.categoryForm.patchValue({
      image_category: imageUrl,
    });

    // Store the file for later use in the onUpdate method
    this.myFile = file;
  }

  async onCancel() {
    this.modalController.dismiss({ dismissed: 'cancel' });
  }
 
  async onUpdate() {
    try {
      if (this.categoryForm.valid) {
        const formData = this.categoryForm.value;
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
              formData.image_category = imageUrl;
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

          // Call the updateCategory method to update the category
          const categoryId = this.category.id;
          const updated = await this.categoryService.updateCategory(
            categoryId,
            formData
          );
          if (updated) {
            // Handle success scenario
            console.log('Category updated successfully');
            // Dismiss the modal and pass any necessary data back to the parent component
            this.modalController.dismiss({ dismissed: 'confirm', updated: true });
          } else {
            // Handle failure scenario
            console.error('Failed to update category');
            // Display an error message
            const alert = await this.alertController.create({
              header: 'Update Failed',
              message: 'Failed to update category.',
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
      console.error('Error updating category:', error);
      // Handle the error scenario as needed
    }
  }

  isFormModified(formData: any): boolean {
    // Compare form values with original commerce data
    return Object.keys(formData).some(
      (key) => formData[key] !== this.category[key]
    );
  }

  async onDelete() {
    try {
      const categoryId = this.category.id; // Get the ID of the commerce to delete
      const confirmed = await this.confirmDelete(); // Ask for confirmation before deleting
  
      if (confirmed) {
        const success = await this.categoryService.deleteCategory(categoryId);
  
        if (success) {
          console.log('Commerce deleted successfully');
          // Dismiss the modal and pass any necessary data back to the parent component
          // this.modalController.dismiss({ dismissed: 'confirm', deleted: true });
          this.modalController.dismiss({ dismissed: 'confirm', deletedCategoryId: this.category.id });
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
        message: 'Are you sure you want to delete this category?',
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
