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
import { UpdateProductModalPage } from '../update-product-modal/update-product-modal.page';
import { Router } from '@angular/router';
import { ProductModalAddPage } from '../product-modal-add/product-modal-add.page'; // Import the ProductModalAddPage component
import { ProductService } from 'src/app/services/product.service'; // Import the ProductService

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  categories: any[] = [];
  commerces: any[] = [];
  products: any[] = [];
  selectedCommerceId: number | null = null;
  categoryForm: FormGroup | null = null;
  productForm: FormGroup = new FormGroup({});

  selectedCategoryId: number | null = null;
  selectedProductId: number | null = null;

  constructor(
    private userService: UserService,
    private commerceService: CommerceService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalController: ModalController,
    private productService: ProductService
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

        if (this.selectedCategoryId !== null) {
          // Fetch and display products associated with the selected category
          await this.fetchProductsByCategoryId(this.selectedCategoryId);
        } else {
          console.error('Selected category ID is null.');
        }
      } else {
        await this.fetchProductsByCategoryId(-1);
        // Reset the category form if no categories found
        this.clearProductForm();
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async fetchProductsByCategoryId(categoryId: number) {
    try {
      // Fetch products associated with the selected category
      const products = await this.productService.getProductsByCategoryId(
        categoryId
      );

      products.sort((a, b) => a.id - b.id);
      this.products = products;

      if (this.products.length > 0) {
        // Select the first product by default
        this.selectedProductId = this.products[0].id; // Set selectedProductId to the ID of the first product
        // Display details of the first product
        // this.setSelectedProductDetails(this.products[0]); // Call a method to set selected product details
        // this.setCategoryForm(this.categories[0]);
        this.setProductForm(this.products[0])
      } else {
      const empty_product = {
        productname: '',
        reference: '',
        price: '',
        description: '',
        image_product: ''
      };
        this.setProductForm(empty_product);
        console.error('No products found.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  // Method to set selected product details
  setSelectedProductDetails(product: any) {
    this.selectedProductId = product.id; 
    if (this.selectedProductId)
    console.log('', this.fetchProductDetails(this.selectedProductId))
  }

  clearProductForm() {
    this.productForm?.reset();
  }

  async onCategoryClick(category: any) {
    // Set the selected category ID
    this.selectedCategoryId = category.id;
    // Set the form for the clicked category
    // this.setCategoryForm(category);

    if (this.selectedCategoryId !== null) {
      // Fetch and display products associated with the clicked category
      await this.fetchProductsByCategoryId(this.selectedCategoryId);
    } else {
      this.clearProductForm()
      await this.fetchProductsByCategoryId(-1);
      console.error('Selected category ID is null.');
    }
  }

  setCategoryForm(category: any) {
    const formGroup: any = {};

    // Iterate through each category field and create form control
    Object.keys(category).forEach((key) => {
      formGroup[key] = new FormControl(category[key], Validators.required);
    });

    this.categoryForm = new FormGroup(formGroup);
  }

  setProductForm(product: any) {
    this.productForm = new FormGroup({
      productname: new FormControl(product.productname, Validators.required),
      reference: new FormControl(product.reference, Validators.required),
      price: new FormControl(product.price, Validators.required),
      description: new FormControl(product.description, Validators.required),
      image_product: new FormControl(product.image_product, Validators.required)
    });
  }
  

  async onProductClick(productId: number) {
    const productDetails = await this.productService.getProductById(productId);
    this.selectedProductId = productId; 
    if (productDetails) {
      this.setProductForm(productDetails) 
    } else {
      console.error('Failed to fetch product details.');
    }
  }

  async fetchProductDetails(productId: number) {
    // Call ProductService to get product details
    const productDetails = await this.productService.getProductById(productId);
    if (productDetails) {
      // Do something with the product details, such as displaying them in the UI
      console.log('Product details:', productDetails);
    } else {
      console.error('Failed to fetch product details.');
    }
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
        const newCategories =
          await this.categoryService.getCategoriesByCommerceId(
            this.selectedCommerceId
          );
        if (newCategories.length > 0) {
          // Retrieve the latest category
          const latestCategory = newCategories[0];

          // Find the index of the former category in the categories array
          const index = this.categories.findIndex(
            (category) => category.id === latestCategory.id
          );

          if (index !== -1) {
            // Replace the former category with the updated category
            this.categories[index] = latestCategory;
          } else {
            // If the former category is not found in the array, add the updated category
            this.categories.unshift(latestCategory);
          }
        }
      } catch (error) {
        console.error('Error refreshing categories:', error);
      }
    }
  }

  async openUpdateProductModal() {
    try {
      if (this.selectedProductId !== null) {
        // Fetch the current product
        const product = await this.productService.getProductById(this.selectedProductId);
  
        // Create the modal with the current product as props
        const modal = await this.modalController.create({
          component: UpdateProductModalPage,
          componentProps: {
            product: product, // Pass the current product as props
          },
        }); 
  
        modal.onDidDismiss().then(async (result) => {
          console.log('Modal dismissed:', result);
          if (result.data.dismissed === 'confirm') {
            // Handle confirmation
            console.log('Modal dismissed with confirm role');
            // For example, refresh product data
            await this.refreshProductDataUp();
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
   
        // Display the modal
        await modal.present();
      } else {
        console.error('Selected product ID is null.');
      }
    } catch (error) {
      console.error('Error opening update product modal:', error);
    }
  }
  

  lockApp() {
    this.router.navigate(['/villes-commerces']);
  }

  async openProductModalAddPage() {
    try {
      if (this.selectedCategoryId !== null) {
        // Fetch the current category
        const category = await this.categoryService.getCategoryByCategoryId(
          this.selectedCategoryId
        );

        // Create the modal with the current category as props
        const modal = await this.modalController.create({
          component: ProductModalAddPage,
          componentProps: {
            category: category, // Pass the current category as props
          },
        });

        modal.onDidDismiss().then((result) => {
          console.log('Modal dismissed:', result);
          if (result.data.dismissed === 'confirm') {
            // Handle confirmation
            console.log('Modal dismissed with confirm role');
            // For example, refresh category data
            this.refreshProductData();
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

        // Display the modal
        await modal.present();
      } else {
        console.error('Selected category ID is null.');
      }
    } catch (error) {
      console.error('Error opening product modal:', error);
    }
  }

  async refreshProductData() {
    try {
      if (this.selectedCategoryId !== null) {
        // Fetch the updated list of products for the current category
        this.products = await this.productService.getProductsByCategoryId(
          this.selectedCategoryId
        );

        this.products.sort((a, b) => a.id - b.id);

        if (this.products.length > 0) {
          const new_product = this.products[this.products.length - 1];
          this.selectedProductId = new_product.id;
          this.setProductForm(new_product);
        }
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
  }

  async refreshProductDataUp() {
    try {
      if (this.selectedCategoryId !== null) {
        // Fetch the updated list of products for the current category
        this.products = await this.productService.getProductsByCategoryId(
          this.selectedCategoryId
        );

        this.products.sort((a, b) => a.id - b.id);

        if (this.selectedProductId) {
          const latestProduct =
            await this.productService.getProductById(
              this.selectedProductId
            ); 
          this.setProductForm(latestProduct);
        }
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
  }
}
