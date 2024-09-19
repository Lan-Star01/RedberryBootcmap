import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendAPIService } from '../../backend-api.service';
import { HttpClientModule } from '@angular/common/http';
import bootstrap from '../../../../main.server';
import { SharedModalComponent } from "../../shared-modal/shared-modal.component";

@Component({
  selector: 'app-main-listing-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, SharedModalComponent],
  templateUrl: './main-listing-page.component.html',
  styleUrl: './main-listing-page.component.css'
})
export class MainListingPageComponent implements OnInit{

  constructor(private fb: FormBuilder, private router: Router, private APIServices: BackendAPIService) {
  }

  regions: any[] = [];
  cities: any[] = [];
  selectedRegionIds: number[] = [];
  realEstates: any[] = [];

  ngOnInit(): void {
    this.getRegions();
    this.getRealEstates();
  }

  navigateToApartmentDetails(apartmentId: string) {
    this.router.navigate(['/apartment', apartmentId]);
  }

  navigateToAddListing() {
    this.router.navigate(['/add-listing']);
  }

  @ViewChild('addAgentModal') modalElement!: ElementRef;

  openModal() {
    const modalElement = document.getElementById('addAgentModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeModal() {
    const modalElement = this.modalElement.nativeElement;
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  //get realestates 
  getRealEstates(): void {
    this.APIServices.getRealEstates().subscribe(
      (data) => {
        this.realEstates = data;
        console.log(data)
      }
    )
  }
  
  //get regions
  getRegions(): void {
    this.APIServices.getRegions().subscribe(
      (data) => {
        this.regions = data;
      }
    )
  }

  onCheckboxChange(event: any): void {
    const regionId = +event.target.value;
    if (event.target.checked) {
      this.selectedRegionIds.push(regionId);
    } else {
      this.selectedRegionIds = this.selectedRegionIds.filter(id => id !== regionId);
    }

    this.filterBySelectedCities();
  }

  filterBySelectedCities(): void {
    console.log('Selected City IDs:', this.selectedRegionIds);
  }

  
}
