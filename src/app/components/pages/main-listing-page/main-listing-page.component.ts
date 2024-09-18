import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendAPIService } from '../../backend-api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-main-listing-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './main-listing-page.component.html',
  styleUrl: './main-listing-page.component.css'
})
export class MainListingPageComponent implements OnInit{

  constructor(private fb: FormBuilder, private router: Router, private APIServices: BackendAPIService) {
    this.myForm();
  }

  regions: any[] = [];
  cities: any[] = [];
  selectedRegionIds: number[] = [];

  ngOnInit(): void {
    this.getRegions();
  }

  navigateToApartmentDetails(apartmentId: string) {
    this.router.navigate(['/apartment', apartmentId]);
  }

  navigateToAddListing() {
    this.router.navigate(['/add-listing']);
  }

  addAgentForm!: FormGroup;

  myForm() {
    this.addAgentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [null, [Validators.required, Validators.min(0)]],
    })
  }
  
  onSubmit() {
    if (this.addAgentForm.valid) {
      console.log(this.addAgentForm.value);
    } else {
      Object.keys(this.addAgentForm.controls).forEach(key => {
        const control = this.addAgentForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  previewUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
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
  
  //get regions
  getRegions(): void {
    this.APIServices.getRegions().subscribe(
      (data) => {
        this.regions = data;
        console.log(data)
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
