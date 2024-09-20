import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Agent, BackendAPIService, City, Region } from '../../services/backend-api.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedModalService } from '../../services/shared-modal.service';
import { SharedModalComponent } from "../../shared-modal/shared-modal.component";

@Component({
  selector: 'app-add-listing-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, SharedModalComponent],
  templateUrl: './add-listing-page.component.html',
  styleUrl: './add-listing-page.component.css'
})
export class AddListingPageComponent implements OnInit {
  constructor(private fb: FormBuilder, private APIServices: BackendAPIService, private router: Router, public modalService: SharedModalService) {
    this.myForm();
  }
  
  isModalOpen$ = this.modalService.isOpen$;
  regions: Region[] = [];
  cities: City[] = [];
  filteredCities: City[] = [];
  selectedRegion: Region | null = null;
  selectedCity: City | null = null;
  selectedAgent: Agent| null = null;
  agents: Agent[] = [];
  addListingForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.getRegions();
    this.getAgents();
    this.getCities();
  } 
  
  myForm() {
    this.addListingForm = this.fb.group({
      forSale: [false],
      forRent: [false],
      address: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      region: [''],
      city: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      area: [null, [Validators.required, Validators.min(0)]],
      numberOfBedrooms: [null, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      agent: ['']
    })
  }
  
  onSubmit() {
    if (this.addListingForm.valid) {
      console.log(this.addListingForm.value);
      const formValue = this.addListingForm.value;
      const formData = new FormData();
      let isRental: number;

      if (formValue.forRent) {
          isRental = 1;
      } else if (formValue.forSale) {
          isRental = 0;
      } else {
          isRental = -1;
      }
      
      formData.append('address', formValue.address);
      if (this.selectedFile instanceof File) {
        formData.append('image', this.selectedFile);
      }
      formData.append('region_id', this.selectedRegion?.id?.toString() ?? '');
      formData.append('description', formValue.description);
      formData.append('city_id', this.selectedCity?.id?.toString() ?? '');
      formData.append('zip_code', formValue.postalCode);
      formData.append('price', formValue.price);
      formData.append('area', formValue.area);
      formData.append('bedrooms', formValue.numberOfBedrooms);
      formData.append('is_rental', isRental.toString());
      formData.append('agent_id', this.selectedAgent?.id?.toString() ?? '');
      

      this.postRealEstates(formData);
      
      

    } else {
      this.markFormGroupTouched(this.addListingForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  openModal() {
    this.modalService.openModal('add-listing');
  }

  navigateToMainPage() {
    this.router.navigate(['/']);
  }
  

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event): void {
    event.preventDefault();
    this.previewUrl = null;
  }
  
  //regions
  getRegions(): void {
    this.APIServices.getRegions().subscribe(
      (data) => {
        this.regions = data;
        console.log(data)
      }
      ,
      (error) => {
        console.error('Error fetching regions:', error);
      }
    )
  }

  getCities(): void {
    this.APIServices.getCities().subscribe(
      (data) => {
        this.cities = data;
        console.log(data)
      },
      (error) => {
        console.error('Error fetching regions:', error);
      }
    )
  }

  selectRegion(region: Region) {
    this.selectedRegion = region;
    this.selectedCity = null;
    this.updateCitiesForSelectedRegion();
  }

  updateCitiesForSelectedRegion() {
    this.filteredCities = [];
    if (this.selectedRegion) {
      this.cities.forEach(city => {
        if (city.region_id === this.selectedRegion!.id) {
          this.filteredCities.push(city);
        }
      });
    }
  }

  selectCity(city: City) {
    this.selectedCity = city;
  }

  selectAgent(agent: Agent) {
    this.selectedAgent = agent;
  }

  //get agents
  getAgents(): void {
    this.APIServices.getAgents().subscribe (
      (data) => {
        this.agents = data;
        console.log(data)
      },
      (error) => {
        console.error('Error fetching regions:', error);
      }
    )
  }

  postRealEstates(realEstatesData: FormData): void {
    this.APIServices.postRealEstates(realEstatesData).subscribe (
      response => {
        console.log("Agent added successfully", response);
        this.addListingForm.reset();
        this.selectedFile = null;
        this.previewUrl = null;
        this.selectedRegion = null;
        this.selectedCity = null;
        this.selectedAgent = null;
      },
      error => {
        console.error("Error adding agent", error);
      }
    )
  }
}
