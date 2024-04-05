import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import Swiper from 'swiper';
// Import ActivatedRoute from '@angular/router'
import { ActivatedRoute, Router } from '@angular/router';
import { CommerceService } from 'src/app/services/commerce.service';
import { ClickedElementService } from 'src/app/services/clicked-element.service';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.page.html',
  styleUrls: ['./category-products.page.scss'],
})
export class CategoryProductsPage implements OnInit {
  clickedCommerce: any;
  categories: any[] = [];
  commerceId!: number;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private clickedElementService: ClickedElementService, // Inject ClickedElementService
    private router: Router
  ) {}
 
  ngOnInit() {
    this.route.params.subscribe((params) => {
      // Extract commerceId from route parameters
      const commerceId = params['id'];
      // Retrieve clickedCommerce from ClickedElementService
      this.clickedElementService.getClickedCommerce().subscribe((clickedCommerce) => {
        this.clickedCommerce = clickedCommerce;
        console.log('clickedCommerce called in  CategoryProductsPage : ', this.clickedCommerce);
      });
      // Retrieve categories belonging to the current commerce
      this.getCategoriesByCommerceId(commerceId);
      this.commerceId = commerceId;
    });
  }

  async getCategoriesByCommerceId(commerceId: number) {
    try {
      this.categories = await this.categoryService.getCategoriesByCommerceId(commerceId);
      // Sort the categories array based on the id property
      this.categories.sort((a, b) => a.id - b.id);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  

  goToCreateCategoryModal(categoryId: number) {
    const clickedCategory = this.categories.find(
      (category) => category.id === categoryId
    );
    this.router.navigate(['/create-category-modal', categoryId, {commerceId: this.commerceId}]);
  }  
  
} 
