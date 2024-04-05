import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommerceService } from 'src/app/services/commerce.service';
import { NavController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { VillesModalPage } from '../villes-modal/villes-modal.page';
import { ChangeDetectorRef } from '@angular/core';
import { ClickedElementService } from 'src/app/services/clicked-element.service';

@Component({
  selector: 'app-villes-commerces',
  templateUrl: './villes-commerces.page.html',
  styleUrls: ['./villes-commerces.page.scss'],
})
export class VillesCommercesPage implements OnInit {
  villes: any[] = [];
  commerces: any[] = [];
  selectedVilleId: number | null = null;
  showSelectWithVille: boolean = true;

  constructor(
    private router: Router,
    private userService: UserService,
    private commerceService: CommerceService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
    private clickedElementService: ClickedElementService, // Inject ClickedElementService

  ) { }

  ngOnInit() {
    // Subscribe to changes in commerces array
    this.commerceService.commerces$.subscribe(commerces => {
      // Update local commerces array with the new data
      this.commerces = commerces;
    });
    console.log('at the Init : ', this.commerces)
    this.fetchAndEnhanceCommerces();
  }

  // Inside the ngOnInit method of your component
  async fetchAndEnhanceCommerces() {
    try {
      // Fetch commerces
      const commerces = 
        await this.commerceService.getAllCommercesBelongingOwnersWithMonthlyFeePaid();

      // Sort the commerces array by ID in ascending order
      commerces.sort((a, b) => a.id - b.id);

      // Enhance commerces array with villeName and business owner information
      for (const commerce of commerces) {
        // Get the ville name for the commerce
        commerce.villeName = await this.commerceService.getVilleNameByVilleId(
          commerce.ville_id
        );

        // Get the business owner information for the commerce
        commerce.businessOwner = await this.userService.getBusinessOwnerById(
          commerce.business_owner_id
        );
      }

      // Now the commerces array is enhanced with villeName and business owner information
      this.commerces = commerces;
    } catch (error) {
      console.error('Error fetching and enhancing commerces:', error);
    }
  }

  goToLoginPage() {
    // Navigate to the login page with replaceUrl option set to true
    this.router.navigate(['/login'], { replaceUrl: true });
  }


  async search(event: CustomEvent) {
    const query: string = event?.detail?.value || '';
  
    try {
      // If a search query is provided, filter commerces
      if (query.trim() !== '') {
        this.commerces = await this.commerceService.searchingCommerces(query);
        // Enhance the filtered commerces array with villeName and other information
        
        for (const commerce of this.commerces) {
          // Get the ville name for the commerce
          commerce.villeName = await this.commerceService.getVilleNameByVilleId(
            commerce.ville_id
          );
  
          // Get any additional information you need for the commerce
          commerce.businessOwner = await this.userService.getBusinessOwnerById(
            commerce.business_owner_id
          );
  
          // Add more enhancements if needed
        }
  
      } else {
        // If no search query, fetch and enhance all commerces
        await this.fetchAndEnhanceCommerces();
      }
  
    } catch (error) {
      console.error('Error searching commerces:', error);
    }
  }
  

  async filterByVilleId(villeId: number) {
    try {
      // Filter commerces by villeId
      const commerces = await this.commerceService.getCommercesByVilleId1(
        villeId
      );

      // Enhance the filtered commerces array with villeName and other information
      for (const commerce of commerces) {
        // Get the ville name for the commerce
        commerce.villeName = await this.commerceService.getVilleNameByVilleId(
          commerce.ville_id
        );

        // Get any additional information you need for the commerce
        commerce.businessOwner = await this.userService.getBusinessOwnerById(
          commerce.business_owner_id
        );

        // Add more enhancements if needed
      }

      // Sort the commerces array by ID in ascending order
      commerces.sort((a, b) => a.id - b.id);

      // Update the commerces array with filtered and enhanced information
      this.commerces = commerces;
    } catch (error) {
      console.error('Error filtering commerces by villeId:', error);
    }
  }


  async clearFilter() {
    try {
      // Clear the filter and fetch and enhance all commerces
      await this.fetchAndEnhanceCommerces();

      // Reset the selected value in the ion-select
      this.selectedVilleId = null;

      // Toggle the rendering of ion-select
      this.showSelectWithVille = true;
    } catch (error) {
      console.error('Error clearing filter:', error);
    }
  }

  async openVillesModalPage() {
    console.log ('this.commerces', this.commerces);
    const villesList = this.commerceService.getVillesFromCommerces(this.commerces);
    console.log ('villes Liste', villesList);
    /* const villesList = await this.commerceService.getAllVilles();
    console.log ('villesList', villesList); */

    const modal = await this.modalCtrl.create({
      component: VillesModalPage,
      componentProps: {
        villesList: villesList, // Pass the list of villes to the modal
      },
    });

    modal.onDidDismiss().then((result) => {
      // Handle the result from the modal if needed
      if (result.data) {
        // Handle the selected ville
        this.filterByVilleId(result.data);
      }
    });

    return await modal.present();
  }

  navigateToCommerceCategories1(commerceId: number) {
    const clickedCommerce = this.commerces.find(
      (commerce) => commerce.id === commerceId
    );
    this.router.navigate(['/category-products', commerceId], {
      state: { clickedCommerce },
    });
  }

  navigateToCommerceCategories(commerceId: number) {
    const clickedCommerce = this.commerces.find(
      (commerce) => commerce.id === commerceId
    );
    // Set the clickedCommerce in the ClickedElementService
    this.clickedElementService.setClickedCommerce(clickedCommerce);
    // Navigate to the category products page
    this.router.navigate(['/category-products', commerceId]);
  }
}
