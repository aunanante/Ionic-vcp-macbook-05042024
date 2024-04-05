import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-villes-modal',
  templateUrl: './villes-modal.page.html',
  styleUrls: ['./villes-modal.page.scss'],
})
export class VillesModalPage implements OnInit {

  @Input() villesList: any[] = [];
  filteredVillesList: any[] = [];
  

  constructor(private modalController: ModalController) { }

  ngOnInit() {
   // Initialize the filtered list with the original list
   this.filteredVillesList = [...this.villesList];
  } 

  onSearch(event: CustomEvent) {
    const searchTerm = (event.detail.value || '').toLowerCase();
    // Filter the villesList based on the search term
    this.filteredVillesList = this.villesList.filter(ville => ville.villename.toLowerCase().includes(searchTerm));
  }

  dismissModal(selectedVilleId?: number) {
    // Dismiss the modal and pass the selected ville id as the result
    this.modalController.dismiss(selectedVilleId);
  }

  selectVille(ville: any) {
    // Dismiss the modal and pass the selected ville id back to VillesCommercesPage
    this.dismissModal(ville.id); // Assuming 'id' is the property you want to pass
  }

}
