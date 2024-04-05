import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CommerceService } from 'src/app/services/commerce.service';
import { CategoryService } from 'src/app/services/category.service'; // Import CategoryService
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommerceCategoriesPage } from '../commerce-categories/commerce-categories.page';
import { ModalController } from '@ionic/angular';
import { UpdateDetailModalPage } from '../update-detail-modal/update-detail-modal.page';
import { Router } from '@angular/router';
import { DetailAddModalPage } from '../detail-add-modal/detail-add-modal.page'; // Import the ProductModalAddPage component
import { ProductService } from 'src/app/services/product.service'; // Import the ProductService
import { DetailService } from 'src/app/services/detail.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  categories: any[] = [];
  commerces: any[] = [];
  products: any[] = [];
  details: any[] = [];
  selectedCommerceId: number | null = null;
  detailForm!: FormGroup;

  selectedCategoryId: number | null = null;
  selectedProductId: number | null = null;
  selectedDetailId: number | null = null;
  currentProduct: any;

  constructor(
    private userService: UserService,
    private commerceService: CommerceService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalController: ModalController,
    private productService: ProductService,
    private detailService: DetailService
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
        } else {
          this.selectedCommerceId = -1;
          this.commerces = [];
        }
      }
    } catch (error) {
      console.error('Error fetching commerces:', error);
    }

    // Fetch details for the selected product
    if (this.selectedProductId !== null) {
      await this.fetchDetailsByProductId(this.selectedProductId);
    } else {
      console.log('selectedProductId is null or undefined');
    }

    // Display the first detail of the current product
    if (this.details.length > 0) {
      this.selectedDetailId = this.details[0].id;
      this.setDetailForm(this.currentProduct, this.details[0]);
    } else {
      console.log('No details found');
    }
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

        if (this.selectedCategoryId !== null) {
          // Fetch and display products associated with the selected category
          await this.fetchProductsByCategoryId(this.selectedCategoryId);
        } else {
          console.error('Selected category ID is null.');
        }
      } else {
        this.selectedCategoryId = -1;
        this.categories = [];
        this.products = [];
        this.details = [];
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

        if (this.selectedProductId !== null) {
          this.currentProduct = await this.productService.getProductById(
            this.selectedProductId
          );

          await this.fetchDetailsByProductId(this.selectedProductId);
          // Initialize the detailForm using the fields of the current product
          this.initializeDetailForm(this.currentProduct);
        } else {
          console.error('Selected category ID is null.');
        }
      } else {
        (this.currentProduct = {
          business_owner_id: '',
          category_id: '',
          commerce_id: '',
          created_at: '',
          description: '',
          id: '',
          image_product: '',
          price: '',
          productname: '',
          reference: '',
          ville_id: '',
        }),
          (this.selectedProductId = -1);
        this.products = [];
        this.details = [];
        // console.error('No products found.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  async fetchDetailsByProductId(productId: number) {
    try {
      const details = await this.detailService.getDetailsByProductId(productId);

      details.sort((a, b) => a.id - b.id);
      this.details = details;

      if (this.details.length > 0) {
        this.selectedDetailId = this.details[0].id;
        this.setDetailForm(this.currentProduct, this.details[0]); // Set the detail form here
      } else {
        this.selectedDetailId = -1;
        this.details = [];
        this.setDetailForm(this.currentProduct, {});
        console.error('No details found.');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  }

  initializeDetailForm(product: any) {
    this.detailForm = this.formBuilder.group({
      detailname: ['', Validators.required],
      description: ['', Validators.required],
      image_detail: ['', Validators.required],
      business_owner_id: [product.business_owner_id || '', Validators.required], // Required validator
      ville_id: [product.ville_id || '', Validators.required], // Required validator
      commerce_id: [product.commerce_id || '', Validators.required], // Required validator
      category_id: [product.category_id || '', Validators.required], // Required validator
      product_id: [this.selectedProductId], // Initialize with selectedProductId
    });
  }

  async setDetailForm(product: any, detail: any) {
    this.detailForm = this.formBuilder.group({
      detailname: [detail.detailname || '', Validators.required],
      description: [detail.description || '', Validators.required],
      image_detail: [detail.image_detail || '', Validators.required],
      business_owner_id: [product.business_owner_id || '', Validators.required], // Required validator
      ville_id: [product.ville_id || '', Validators.required], // Required validator
      commerce_id: [product.commerce_id || '', Validators.required], // Required validator
      category_id: [product.category_id || '', Validators.required], // Required validator
      product_id: [this.selectedProductId], // Initialize with selectedProductId
    });
  }

  async onCommerceClick(commerceId: number) {
    this.selectedCommerceId = commerceId;
    this.selectedCategoryId = null; // Reset selected category
    this.selectedProductId = null; // Reset selected product
    this.selectedDetailId = null; // Reset selected detail
    this.details = []; // Reset details
    await this.fetchCategoriesByCommerceId(commerceId);

    // Fetch and display the details for the first product in the new list
    if (this.products.length > 0) {
      await this.onProductClick(this.products[0].id);
    }
  }

  async onCategoryClick(category: any) {
    this.selectedCategoryId = category.id;
    await this.fetchProductsByCategoryId(category.id);
    this.selectedProductId = null; // Reset selected product
    this.selectedDetailId = null; // Reset selected detail
    this.details = []; // Reset details
    // Fetch and display the details for the first product in the new list
    if (this.products.length > 0) {
      await this.onProductClick(this.products[0].id);
    }
  }

  async onProductClick(productId: number) {
    this.selectedProductId = productId;
    this.currentProduct = await this.productService.getProductById(productId);
    // Fetch and display the details for the selected product
    await this.fetchDetailsByProductId(productId);
  }

  async onDetailClick(detail: any) {
    this.selectedDetailId = detail.id;
    // Set the detail form based on the clicked detail
    await this.setDetailForm(this.currentProduct, detail);
  }

  async openDetailAddModalPage() {
    try {
      if (this.currentProduct) {
        // Create the modal with the current product as props
        const modal = await this.modalController.create({
          component: DetailAddModalPage,
          componentProps: {
            product: this.currentProduct, // Pass the current product as props
          },
        });

        modal.onDidDismiss().then((result) => {
          if (result.data.dismissed === 'confirm') {
            this.refreshDetailData();
          } else if (result.data.dismissed === 'cancel') {
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
        console.error('Current product is null.');
      }
    } catch (error) {
      console.error('Error opening detail add modal:', error);
    }
  }

  async openUpdateDetailModalPage() {
    try {
      if (this.selectedDetailId !== null) {
        // Fetch the current detail using its ID
        const detail = await this.detailService.getDetailById(
          this.selectedDetailId
        );

        // Create the modal with the current detail as props
        const modal = await this.modalController.create({
          component: UpdateDetailModalPage,
          componentProps: {
            detail: detail, // Pass the current detail as props
          },
        });

        modal.onDidDismiss().then(async (result) => {
          if (result.data.dismissed === 'confirm') {
            await this.refreshDetailData();
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
        console.error('Selected detail ID is null.');
      }
    } catch (error) {
      console.error('Error opening update detail modal:', error);
    }
  }

  lockApp() {
    this.router.navigate(['/villes-commerces']);
  }

  async refreshDetailData() {
    try {
      if (this.selectedProductId !== null) {
        this.details = await this.detailService.getDetailsByProductId(
          this.selectedProductId
        );

        this.details.sort((a, b) => a.id - b.id);

        if (this.details.length > 0) {
          const new_detail = this.details[this.details.length - 1];
          const product = this.productService.getProductById(
            this.selectedProductId
          );
          this.selectedDetailId = new_detail.id;
          this.setDetailForm(product, new_detail);
        }
      }
    } catch (error) {
      console.error('Error refreshing details:', error);
    }
  }

  async refreshDetailDataUp() {
    try {
      if (this.selectedProductId !== null) {
        this.details = await this.detailService.getDetailsByProductId(
          this.selectedProductId
        );

        this.details.sort((a, b) => a.id - b.id);

        if (this.selectedDetailId) {
          const new_detail = await this.detailService.getDetailById(
            this.selectedDetailId
          );

          const product = this.productService.getProductById(
            this.selectedProductId
          );

          this.setDetailForm(product, new_detail);
        }
        
      }
    } catch (error) {
      console.error('Error refreshing details:', error);
    }
  }
}
