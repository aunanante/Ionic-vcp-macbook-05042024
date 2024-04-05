import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { CommerceService } from 'src/app/services/commerce.service';
import { UserService } from 'src/app/services/user.service';
import { ProductService } from 'src/app/services/product.service'; // Import ProductService
import { ClickedElementService } from 'src/app/services/clicked-element.service';


@Component({
  selector: 'app-create-category-modal',
  templateUrl: './create-category-modal.page.html',
  styleUrls: ['./create-category-modal.page.scss'],
})
export class CreateCategoryModalPage implements OnInit {

  categoryId!: number; // Variable to store categoryId
  clickedCategory: any; // Variable to store the clicked category
  commerceId!: number; // Variable to store the commerceId
  clickedCommerce: any; // Variable to store the clicked commerce
  products: any[] = []; // Variable to store products associated with the categoryId

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private clickedElementService: ClickedElementService, // Inject ClickedElementService
    private productService: ProductService // Inject ProductService
  ) { }

  ngOnInit() {
     // Subscribe to route params and extract the productId and categoryId
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.commerceId = params['commerceId']; // Capture categoryId

      console.log('this.categoryId transferred : ', this.categoryId);
      console.log('this.commerceId transferred : ', this.commerceId);

      // Fetch products associated with the categoryId
      this.fetchProductsByCategoryId(this.categoryId);

    });
    

    // Retrieve clickedCommerce from ClickedElementService
    this.clickedElementService.getClickedCommerce().subscribe((clickedCommerce) => {
      this.clickedCommerce = clickedCommerce;
      console.log('this.clickedCommerce : ', this.clickedCommerce);
    });
  }

  async fetchProductsByCategoryId(categoryId: number) {
    try {
      this.products = await this.productService.getProductsByCategoryId(categoryId);
      console.log('Products:', this.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  goBackToCategoryPage() {
    // Navigate back to the CategoryProductsPage with commerceId
    this.router.navigate(['/category-products', this.commerceId]); 
  } 

  openProductDetails(productId: number) {
    // Navigate to ProductDetailsPage and pass the product ID and category ID as parameters
    this.router.navigate(['/product-details', productId, { categoryId: this.categoryId }]);
  } 
}
