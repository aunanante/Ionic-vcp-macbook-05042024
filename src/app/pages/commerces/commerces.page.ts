import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { CommerceService } from 'src/app/services/commerce.service';
import { ModalController } from '@ionic/angular';
import { CommerceModalPage } from '../commerce-modal/commerce-modal.page'; // Adjust path as needed
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateCommerceModalPage } from '../update-commerce-modal/update-commerce-modal.page'; // Adjust path as needed

@Component({
  selector: 'app-commerces',
  templateUrl: './commerces.page.html',
  styleUrls: ['./commerces.page.scss'],
})
export class CommercesPage implements OnInit {
  firstCommerce: any;
  noCommerceMessage!: string;
  commerceForm!: FormGroup;
  villes: any[] = [];
  villeName: string | null = null;
  commerces: any[] = []; // Define commerces property
  selectedCommerceId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private commerceService: CommerceService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    try {
      this.commerceForm = this.formBuilder.group({
        commercename: ['', Validators.required],
        services: ['', Validators.required],
        image_commerce: [''], // Assuming this field is optional
        ville_id: [''],
        // Add more form controls as needed for other fields
      });

      this.villes = await this.commerceService.getAllVilles();

      // Fetch businessOwnerId
      const businessOwnerId = await this.userService.getBusinessOwnerId();

      if (businessOwnerId !== null) {
        const commerces = await this.commerceService.getCommercesByBusinessOwnerWithMonthlyFeePaid(businessOwnerId);
        // Sort the commerces array by ID in ascending order
        commerces.sort((a, b) => a.id - b.id);
      
        // Now the commerces array is sorted by ID
        this.commerces = commerces;
        console.log('commerces', this.commerces);
      
        // Check if commerces array is empty
        if (this.commerces.length === 0) {
          // If commerces array is empty, lock the app and navigate to '/villes-commerces'
          this.lockApp();
          // this.router.navigate(['/villes-commerces']);
        } else {
          // Call loadFirstCommerce method with the fetched commerces
          this.loadFirstCommerce(this.commerces);
        }
      }
    } catch (error) {
      console.error('Error loading commerces:', error);
    }
  }

  async loadFirstCommerce(commerces: any[]) {
    try {
      // Check if commerces array is not empty
      if (commerces.length > 0) {
        this.firstCommerce = commerces[0];
        this.selectedCommerceId = this.firstCommerce.id;
        // Fetch the ville name based on the ville_id of the first commerce
        const villeId = this.firstCommerce.ville_id;
        const villeName = await this.commerceService.getVilleNameByVilleId(
          villeId
        );

        this.commerceForm.patchValue({
          commercename: this.firstCommerce.commercename,
          services: this.firstCommerce.services,
          image_commerce: this.firstCommerce.image_commerce || '',
          business_owner_id: this.firstCommerce.business_owner_id,
          ville_id: villeName,
          // Patch other form controls with corresponding commerce details
        });
      } else {
        this.noCommerceMessage = 'No commerce for the current business owner.';
      }
    } catch (error) {
      console.error('Error loading first commerce:', error);
    }
  }

  lockApp() {
    this.router.navigate(['/villes-commerces']);
  }

  async openCommerceModal() {
    try {
      const businessOwnerId = await this.userService.getBusinessOwnerId();
      const modal = await this.modalController.create({
        component: CommerceModalPage,
        componentProps: {
          businessOwnerId: businessOwnerId,
        },
      });

      // Handle modal dismissal if needed
      modal.onDidDismiss().then((result) => {
        console.log('Modal dismissed:', result);
        if (result.data.dismissed === 'confirm') {
          // Handle confirmation
          console.log('Modal dismissed with confirm role');
          // For example, refresh commerce data
          this.refreshCommerceData();
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
    } catch (error) {
      console.error('Error opening commerce modal:', error);
    }
  }

  // Example method to refresh commerce data after adding a new commerce
  async refreshCommerceData() {
    try {
      const businessOwnerId = await this.userService.getBusinessOwnerId();
      if (businessOwnerId) {
        const commerces =
          await this.commerceService.getCommercesByBusinessOwnerWithMonthlyFeePaid(
            businessOwnerId
          );

        // Sort the commerces array by ID in ascending order
        commerces.sort((a, b) => a.id - b.id);

        // Now the commerces array is sorted by ID
        this.commerces = commerces;

        // Set firstCommerce to the last item in the commerces array
        if (this.commerces.length > 0) {
          this.firstCommerce = this.commerces[this.commerces.length - 1];

          // Repopulate form fields with updated data
          this.loadCommerceDetails(this.firstCommerce);

          this.commerceService.setCommerces( this.commerces);
        }
      }
    } catch (error) {
      console.error('Error refreshing commerce data:', error);
      // Handle error as needed
    }
  }

  async refreshCommerceDataUp() {
    try {
      if (this.selectedCommerceId) {
        const commerce = await this.commerceService.getCommerceById(this.selectedCommerceId);
        this.loadCommerceDetails(commerce);

        this.commerceService.setCommerces( this.commerces);
      }
      
      
    } catch (error) {
      console.error('Error refreshing commerce data:', error);
      // Handle error as needed
    }
  }

  async updateVilleName(villeId: number) {
    this.villeName = await this.commerceService.getVilleNameByVilleId(villeId);
  }

  async loadCommerceDetails(commerce: any) {
    this.selectedCommerceId = commerce.id;
    this.firstCommerce = commerce;
    const villeId = this.firstCommerce.ville_id;
    const villeName = await this.commerceService.getVilleNameByVilleId(villeId);
    // Populate form with details of the selected commerce
    this.commerceForm.patchValue({
      commercename: commerce.commercename,
      services: commerce.services,
      image_commerce: commerce.image_commerce || '',
      ville_id: villeName,
      // Populate other form controls as needed
    });
  }

  async openUpdateCommerceModal() {
    try {
      // Check if selectedCommerceId is defined
      if (!this.selectedCommerceId) {
        console.error('No commerce selected.');
        return;
      }

      // Fetch the commerce corresponding to the selectedCommerceId
      const selectedCommerce = await this.commerceService.getCommerceById(
        this.selectedCommerceId
      );

      // Open the modal with the UpdateCommerceModalPage component
      const modal = await this.modalController.create({
        component: UpdateCommerceModalPage,
        componentProps: {
          commerce: selectedCommerce, // Pass the selected commerce as props
        },
      });

      // Handle modal dismissal if needed
      modal.onDidDismiss().then((result) => {
        console.log('Modal dismissed:', result);
        if (result.data.dismissed === 'confirm') {
          // Handle confirmation
          console.log('Modal dismissed with confirm role');
          // For example, refresh commerce data
          this.refreshCommerceDataUp();
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

      // Present the modal
      await modal.present();
    } catch (error) {
      console.error('Error opening update commerce modal:', error);
    }
  }
}
