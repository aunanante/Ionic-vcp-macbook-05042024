import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClickedElementService } from 'src/app/services/clicked-element.service';
import { DetailService } from 'src/app/services/detail.service'; // Import DetailService


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {

  productId!: number;
  categoryId!: number; // Add categoryId property
  commerceId!: number;
  details: any[] = []; // Variable to store product details
  clickedCommerce: any

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private clickedElementService: ClickedElementService, 
    private detailService: DetailService // Inject DetailService  

  ) { }

  ngOnInit() {
    // Subscribe to route params and extract the productId and categoryId
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.categoryId = params['categoryId']; // Capture categoryId
    });

    console.log('this.productId', this.productId);
    console.log('this.categoryId', this.categoryId);

    // Retrieve clickedCommerce from ClickedElementService
    this.clickedElementService.getClickedCommerce().subscribe((clickedCommerce) => {
      this.clickedCommerce = clickedCommerce;
      console.log('this.clickedCommerce : ', this.clickedCommerce);
      this.commerceId = clickedCommerce.id
      console.log('this.clickedCommerce : ', this.clickedCommerce);
    });

    // Fetch details associated with the current product
    this.fetchDetailsByProductId(this.productId);

  }

  goBack() {
    // Navigate back to CreateCategoryModalPage with categoryId
    this.router.navigate(['/create-category-modal', this.categoryId, {commerceId: this.commerceId}]);
  }

  async fetchDetailsByProductId(productId: number) {
    try {
      // Call DetailService to fetch details by productId
      this.details = await this.detailService.getDetailsByProductId(productId);
      console.log('Product Details:', this.details);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  }
}
