import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendAPIService, City, Region } from '../../services/backend-api.service';
import { HttpClientModule } from '@angular/common/http';
import bootstrap from '../../../../main.server';
import { SharedModalComponent } from "../../shared-modal/shared-modal.component";
import { SharedModalService } from '../../services/shared-modal.service';

@Component({
  selector: 'app-main-listing-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, SharedModalComponent, FormsModule],
  templateUrl: './main-listing-page.component.html',
  styleUrl: './main-listing-page.component.css'
})
export class MainListingPageComponent implements OnInit{

  constructor(private fb: FormBuilder, private router: Router, private APIServices: BackendAPIService, public modalService: SharedModalService) {
  }

  isModalOpen$ = this.modalService.isOpen$;
  regions: Region[] = [];
  cities: City[] = [];
  selectedRegionIds: number[] = [];
  realEstates: any[] = [];
  minPricePlaceholder: string = '';
  maxPricePlaceholder: string = '';
  minAreaPlaceholder: string = '';
  maxAreaPlaceholder: string = '';
  error: string = '';
  priceOptions: string[] = ['50500', '100500', '150500', '200500', '300500'];
  areaOptions: string[] = ['20', '30', '40', '50', '60'];
  filteredRealEstates: any[] = [];
  minPrice: number = 0;
  maxPrice: number = 0;
  minArea: number = 0;
  maxArea: number = 0;
  bedroomCount: number = 0;
  confirmedRegionIds: number[] = [];
  confirmedMinPrice: number = 0;
  confirmedMaxPrice: number = 0;
  confirmedMinArea: number = 0;
  confirmedMaxArea: number = 0;
  confirmedBedroomCount: number = 0;

  ngOnInit(): void {
    this.getRegions();
    this.getRealEstates();
    this.loadSavedFilters();
  }

  navigateToApartmentDetails(apartmentId: string, imageUrl: string) {
    this.router.navigate(['/apartment', apartmentId], { queryParams: { img: imageUrl } });
  }

  navigateToAddListing() {
    this.router.navigate(['/add-listing']);
  }

  @ViewChild('addAgentModal') modalElement!: ElementRef;

  openModal() {
    this.modalService.openModal('main');
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
        this.filteredRealEstates = data;
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
    this.saveFilterState();
  }  

  handleRangeClick(value: string, isMin: boolean, isPrice: boolean, event: Event): void {
    event.stopPropagation();
  
    const numericValue = parseFloat(value.replace(',', ''));
  
    if (isPrice) {
      if (isMin) {
        this.minPricePlaceholder = value;
        if (this.maxPricePlaceholder && numericValue > parseFloat(this.maxPricePlaceholder.replace(',', ''))) {
          this.error = 'ჩაწერეთ ვალიდური მონაცემები';
        } else {
          this.error = '';
        }
      } else {
        this.maxPricePlaceholder = value;
        if (this.minPricePlaceholder && numericValue < parseFloat(this.minPricePlaceholder.replace(',', ''))) {
          this.error = 'ჩაწერეთ ვალიდური მონაცემები';
        } else {
          this.error = '';
        }
      }
    } else {
      if (isMin) {
        this.minAreaPlaceholder = value;
        if (this.maxAreaPlaceholder && numericValue > parseFloat(this.maxAreaPlaceholder.replace(',', ''))) {
          this.error = 'ჩაწერეთ ვალიდური მონაცემები';
        } else {
          this.error = '';
        }
      } else {
        this.maxAreaPlaceholder = value;
        if (this.minAreaPlaceholder && numericValue < parseFloat(this.minAreaPlaceholder.replace(',', ''))) {
          this.error = 'ჩაწერეთ ვალიდური მონაცემები';
        } else {
          this.error = '';
        }
      }
    }
  }
 
  handlePriceInputChange(value: string, isMin: boolean): void {
    const numericValue = parseFloat(value.replace(/[^\d]/g, ''));
    const formattedValue = isNaN(numericValue) ? '' : numericValue.toString();
  
    if (isMin) {
      this.minPricePlaceholder = formattedValue;
    } else {
      this.maxPricePlaceholder = formattedValue;
    }
    this.saveFilterState();
  }
  
  handleAreaInputChange(value: string, isMin: boolean): void {
    const numericValue = parseFloat(value.replace(/[^\d]/g, ''));
    const formattedValue = isNaN(numericValue) ? '' : numericValue.toString();
  
    if (isMin) {
      this.minAreaPlaceholder = formattedValue;
    } else {
      this.maxAreaPlaceholder = formattedValue;
    }
    this.saveFilterState();
  }
  

  setPriceRange(min: string, max: string): void {
    const minPrice = parseFloat(min) || 0;
    const maxPrice = parseFloat(max) || Infinity;
  
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
  }

  setAreaRange(min: string, max: string): void {
    const minArea = parseFloat(min) || 0;
    const maxArea = parseFloat(max) || Infinity;

    this.minArea = minArea;
    this.maxArea = maxArea;
  }

  setBedroomCount(count: string): void {
    const parsedCount = parseInt(count, 10);
    this.bedroomCount = isNaN(parsedCount) ? 0 : parsedCount;
    this.saveFilterState();
  }

  filterListings(): void {
    if (
      this.confirmedRegionIds.length === 0 &&
      this.confirmedMinPrice === 0 &&
      this.confirmedMaxPrice === 0 &&
      this.confirmedMinArea === 0 &&
      this.confirmedMaxArea === 0 &&
      this.confirmedBedroomCount === 0
    ) {
      this.filteredRealEstates = [...this.realEstates];
      return;
    }
  
    this.filteredRealEstates = this.realEstates.filter((apartment) => {
      const regionMatch = this.confirmedRegionIds.length === 0 || this.confirmedRegionIds.includes(apartment.city.region.id);
  
      const priceMatch = (!this.confirmedMinPrice || apartment.price >= this.confirmedMinPrice) &&
                         (!this.confirmedMaxPrice || apartment.price <= this.confirmedMaxPrice);
  
      const areaMatch = (!this.confirmedMinArea || apartment.area >= this.confirmedMinArea) &&
                        (!this.confirmedMaxArea || apartment.area <= this.confirmedMaxArea);
  
      const bedroomMatch = !this.confirmedBedroomCount || apartment.bedrooms === this.confirmedBedroomCount;
  
      return regionMatch && priceMatch && areaMatch && bedroomMatch;
    });
  }

  saveFilterState(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('minPricePlaceholder', this.minPricePlaceholder);
      localStorage.setItem('maxPricePlaceholder', this.maxPricePlaceholder);
      localStorage.setItem('minAreaPlaceholder', this.minAreaPlaceholder);
      localStorage.setItem('maxAreaPlaceholder', this.maxAreaPlaceholder);
      localStorage.setItem('bedroomCount', this.bedroomCount.toString());
      localStorage.setItem('selectedRegionIds', JSON.stringify(this.selectedRegionIds));
    }
  }

  loadSavedFilters(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.minPricePlaceholder = localStorage.getItem('minPricePlaceholder') || '';
      this.maxPricePlaceholder = localStorage.getItem('maxPricePlaceholder') || '';
      this.minAreaPlaceholder = localStorage.getItem('minAreaPlaceholder') || '';
      this.maxAreaPlaceholder = localStorage.getItem('maxAreaPlaceholder') || '';
      this.bedroomCount = parseInt(localStorage.getItem('bedroomCount') || '0', 10);
      this.selectedRegionIds = JSON.parse(localStorage.getItem('selectedRegionIds') || '[]');
    }
  }

  clearPriceFilters(): void {
    this.confirmedMinPrice = 0;
    this.confirmedMaxPrice = 0;
    this.minPrice = 0;
    this.maxPrice = 0;
    
    this.filterListings();
    this.saveFilterState();
  }

  clearAreaFilters(): void {
    this.minAreaPlaceholder = '';
    this.maxAreaPlaceholder = '';
    this.minArea = 0;
    this.maxArea = 0;
  
    this.confirmedMinArea = 0;
    this.confirmedMaxArea = 0;
  
    this.filterListings();
    this.saveFilterState();
  }
  
  
  clearBedroomFilters(): void {
    this.bedroomCount = 0;
  
    this.saveFilterState();
  }
  
  clearRegionFilters(): void {
    this.selectedRegionIds = [];
  
    this.saveFilterState();
  }
  
  confirmRegionSelection(): void {
    this.confirmedRegionIds = [...this.selectedRegionIds];
  
    this.filterListings();
    this.saveFilterState();
  }
  

  confirmPriceSelection(): void {
    this.confirmedMinPrice = this.minPrice;
    this.confirmedMaxPrice = this.maxPrice;
    
  
    this.filterListings();
    this.saveFilterState();

    this.minPricePlaceholder = '';
    this.maxPricePlaceholder = '';
  }
  

  confirmAreaSelection(): void {
    this.confirmedMinArea = this.minArea;
    this.confirmedMaxArea = this.maxArea;
  
    this.filterListings();
    this.saveFilterState();

    this.minAreaPlaceholder = '';
    this.maxAreaPlaceholder = '';
  }
  

  confirmBedroomSelection(): void {
    this.confirmedBedroomCount = this.bedroomCount;
  
    this.filterListings();
    this.saveFilterState();
  }

  removeRegion(regionId: number): void {
    this.confirmedRegionIds = this.confirmedRegionIds.filter(id => id !== regionId);
  
    this.selectedRegionIds = this.selectedRegionIds.filter(id => id !== regionId);
  
    this.filterListings();
  
    this.saveFilterState();
  }
  
  
  getRegionName(regionId: number): string {
    const region = this.regions.find(r => r.id === regionId);
    
    return region ? region.name : 'Unknown Region';
  }

  
  clearAllFilters(): void {
    this.confirmedRegionIds = [];
    this.confirmedMinPrice = 0;
    this.confirmedMaxPrice = 0;
    this.confirmedMinArea = 0;
    this.confirmedMaxArea = 0;
    this.confirmedBedroomCount = 0;
  
    this.selectedRegionIds = [];
    this.minPricePlaceholder = '';
    this.maxPricePlaceholder = '';
    this.minAreaPlaceholder = '';
    this.maxAreaPlaceholder = '';
    this.bedroomCount = 0;
  
    this.filteredRealEstates = [...this.realEstates];
  
    this.saveFilterState();
  }
  
  
  isAnyFilterActive(): boolean {
    return this.confirmedMinPrice > 0 || this.confirmedMaxPrice > 0 ||
           this.confirmedMinArea > 0 || this.confirmedMaxArea > 0 ||
           this.confirmedRegionIds.length > 0 || this.confirmedBedroomCount > 0;
  }
  
  
  
}
