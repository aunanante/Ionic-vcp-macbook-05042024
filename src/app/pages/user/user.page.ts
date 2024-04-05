import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ModalController, NavController } from '@ionic/angular';
import { BusinessOwnerModalPage } from '../business-owner-modal/business-owner-modal.page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  businessOwners: any[] = [];
  currentUserEmail: string | null = null;
  businessOwnerForm: FormGroup;

  constructor(
    private userService: UserService,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.businessOwnerForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      adresse: [''],
      telephone1: [''],
      telephone2: [''],
      image_owner: [''],
      monthly_fee_paid: [{ value: '', disabled: true }]
    });

    // Listen for navigation events to refresh data
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(async () => {
      // Fetch data whenever navigation ends
      await this.fetchAllBusinessOwners();
    });
  }

  async ngOnInit() {
    this.currentUserEmail = await this.userService.getCurrentUserEmail();
    await this.fetchAllBusinessOwners();
  }

  async fetchAllBusinessOwners() {
    if (this.currentUserEmail) {
      this.businessOwners = await this.userService.getBusinessOwnersByEmail(this.currentUserEmail);
      if (this.businessOwners.length > 0) {
        // Populate form with data from the first business owner
        this.populateForm(this.businessOwners[0]);
      }
    }
  }

  populateForm(owner: any) {
    this.businessOwnerForm.patchValue({
      email: owner.email,
      name: owner.name,
      adresse: owner.adresse,
      telephone1: owner.telephone1,
      telephone2: owner.telephone2,
      image_owner: owner.image_owner,
      monthly_fee_paid: owner.monthly_fee_paid
    });
  }

  async openBusinessOwnerModal() {
    const modal = await this.modalController.create({
      component: BusinessOwnerModalPage,
      componentProps: {
        email: this.currentUserEmail,
        monthly_fee_paid: false
      }
    }); 
  
    modal.onDidDismiss().then(async (data) => {
      if (data && data.data !== undefined) {
        if (data.data === true) {
          // Close the modal if addedOwner is true
          // You can also handle success message here if needed
          console.log('Business owner added successfully');
        } else {
          // Close the modal if addedOwner is false
          console.error('Failed to add business owner');
        }
        
        // Fetch all business owners again after the modal is dismissed
        await this.fetchAllBusinessOwners();
      }
    });

    await modal.present();
  }

  onCancel() {
    // Handle cancel action here if needed
    console.log('Cancelled');
  }

  onSubmit() {
    // Handle form submission here if needed
    console.log('Form submitted');
  }

  addPhoto() {
    // Handle add photo action here if needed
    console.log('Add photo clicked');
  }

  openUpdateBusinessOwnerPage() {
    const currentBusinessOwner = this.businessOwners[0]; // Assuming you always have at least one business owner
    this.navCtrl.navigateForward('/update-business-owner-modal', {
      queryParams: {
        email: currentBusinessOwner.email,
        name: currentBusinessOwner.name,
        adresse: currentBusinessOwner.adresse,
        telephone1: currentBusinessOwner.telephone1,
        telephone2: currentBusinessOwner.telephone2,
        image_owner: currentBusinessOwner.image_owner,
        monthly_fee_paid: currentBusinessOwner.monthly_fee_paid
      }
    });
  }
}
