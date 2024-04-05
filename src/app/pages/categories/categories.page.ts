import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CommerceService } from 'src/app/services/commerce.service';
import { CategoryService } from 'src/app/services/category.service'; // Import CategoryService
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { CommerceCategoriesPage } from '../commerce-categories/commerce-categories.page';
import { ModalController } from '@ionic/angular';
import { UpdateCategoryModalPage } from '../update-category-modal/update-category-modal.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categories: any[] = [];
  commerces: any[] = [];
  selectedCommerceId: number | null = null;
  categoryForm: FormGroup | null = null;
  selectedCategoryId: number | null = null;

  constructor(
    private userService: UserService,
    private commerceService: CommerceService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      // Fetch business owner ID
      const businessOwnerId = await this.userService.getBusinessOwnerId();

      // Fetch commerces
      if (businessOwnerId !== null) {
        const monthlyFeePaid = await this.userService.getMonthlyFeePaidStatus(
          businessOwnerId
        );
        if (!monthlyFeePaid) {
          this.lockApp();
          return;
        }
        const commerces =
          await this.commerceService.getCommercesByBusinessOwnerWithMonthlyFeePaid(
            businessOwnerId
          );

        commerces.sort((a, b) => a.id - b.id);
        this.commerces = commerces;

        // Check if there are commerces in the list
        if (this.commerces.length > 0) {
          // Select the first commerce by default
          this.selectedCommerceId = this.commerces[0].id;
          // Fetch categories associated with the selected commerce
          if (this.selectedCommerceId !== null) {
            await this.fetchCategoriesByCommerceId(this.selectedCommerceId);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching commerces:', error);
    }
  }

  async onCommerceClick(commerceId: number) {
    this.selectedCommerceId = commerceId;
    await this.fetchCategoriesByCommerceId(commerceId);
  }

  async fetchCategoriesByCommerceId(commerceId: number) {
    try {
      // Fetch categories associated with the selected commerce
      const categories = await this.categoryService.getCategoriesByCommerceId(
        commerceId
      );
      
      categories.sort((a, b) => a.id - b.id);
      this.categories = categories;

      if (this.categories.length > 0) {
        // Select the first category by default
        this.selectedCategoryId = this.categories[0].id;
        // Display details of the first category
        this.setCategoryForm(this.categories[0]);
      } else {
        // Reset the category form if no categories found
        this.clearCategoryForm();
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  clearCategoryForm() {
    this.categoryForm?.reset();
  }

  onCategoryClick(category: any) {
    // Set the selected category ID
    this.selectedCategoryId = category.id;
    // Set the form for the clicked category
    this.setCategoryForm(category);
  }

  setCategoryForm(category: any) {
    const formGroup: any = {};

    // Iterate through each category field and create form control
    Object.keys(category).forEach((key) => {
      formGroup[key] = new FormControl(category[key], Validators.required);
    });

    this.categoryForm = new FormGroup(formGroup);
  }

  // Method to open CommerceCategories modal
  async openCommerceCategoriesPage() {
    if (this.selectedCommerceId !== null) {
      // Fetch the complete commerce object using the ID
      const commerce = await this.commerceService.getCommerceById(
        this.selectedCommerceId
      );
      if (commerce) {
        const modal = await this.modalController.create({
          component: CommerceCategoriesPage,
          componentProps: {
            business_owner_id: commerce.business_owner_id,
            ville_id: commerce.ville_id,
            commerce_id: commerce.id,
          },
        });

        modal.onDidDismiss().then((result) => {
          console.log('Modal dismissed:', result);
          if (result.data.dismissed === 'confirm') {
            // Handle confirmation
            console.log('Modal dismissed with confirm role');
            // For example, refresh category data
            this.refreshCategoryData();
          } else if (result.data.dismissed === 'cancel') {
            // Handle cancellation
            console.log('Modal dismissed with cancel role');
          } else {
            // Handle other dismissals
            console.log(
              'Modal dismissed with unexpected role:',
              result.data.dismissed
            );
          }
        });

        return await modal.present();
      }
    }
  }

  async refreshCategoryData() {
    if (this.selectedCommerceId !== null) {
      try {
        this.categories = await this.categoryService.getCategoriesByCommerceId(
          this.selectedCommerceId
        );

        this.categories.sort((a, b) => a.id - b.id);

        if (this.categories.length > 0) {
          const new_category = this.categories[this.categories.length - 1];
          this.selectedCategoryId = new_category.id;
          this.setCategoryForm(new_category);
        }
      } catch (error) {
        console.error('Error refreshing categories:', error);
      }
    }
  }

  async refreshCategoryDataUp() {
    if (this.selectedCommerceId !== null) {
      try {
        const categories = await this.categoryService.getCategoriesByCommerceId(
          this.selectedCommerceId
        );
        categories.sort((a, b) => a.id - b.id);
        this.categories = categories;

        if (this.selectedCategoryId) {
          const latestCategory =
            await this.categoryService.getCategoryByCategoryId(
              this.selectedCategoryId
            ); 
          this.setCategoryForm(latestCategory);
        }
      } catch (error) {
        console.error('Error refreshing categories:', error);
      }
    }
  } 

  async openUpdateCategoryModal() {
    let defaultCategory: any;

    // Check if there is a selected category
    if (this.selectedCategoryId !== null) {
      // Use the selected category as the default if available
      defaultCategory = this.categories.find(
        (category) => category.id === this.selectedCategoryId
      );
    } else if (this.categories.length > 0) {
      // If no selected category, use the first category from the list of categories
      defaultCategory = this.categories[0];
    }

    // Open the modal with the default category as a prop
    const modal = await this.modalController.create({
      component: UpdateCategoryModalPage,
      componentProps: {
        category: defaultCategory,
      },
    });

    modal.onDidDismiss().then(async (result) => {
      console.log('Modal dismissed:', result);
      if (result.data.dismissed === 'confirm') {
        // Handle confirmation
        console.log('Modal dismissed with confirm role');

        // Refresh the updated category
        await this.refreshCategoryDataUp();
      } else if (result.data.dismissed === 'cancel') {
        // Handle cancellation
        console.log('Modal dismissed with cancel role');
      } else {
        // Handle other dismissals
        console.log(
          'Modal dismissed with unexpected role:',
          result.data.dismissed
        );
      }
    });

    await modal.present();
  }

  lockApp() {
    // Disable form controls or redirect to a locked page
    // this.commerceForm.disable();
    // Example: Show a locked message or redirect to a locked page
    this.router.navigate(['/villes-commerces']);
  }
}
