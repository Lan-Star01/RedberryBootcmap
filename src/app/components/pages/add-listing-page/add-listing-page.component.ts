import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackendAPIService } from '../../backend-api.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

interface Region {
  id: number;
  name: string;
}

interface City {
  id: number;
  region_id: number;
  name: string;
}

interface Agent {
  id: number;
  name: string;
  surname: string;
  avatar: string;
}

@Component({
  selector: 'app-add-listing-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-listing-page.component.html',
  styleUrl: './add-listing-page.component.css'
})
export class AddListingPageComponent implements OnInit {
  constructor(private fb: FormBuilder, private APIServices: BackendAPIService, private router: Router) {
    this.myForm();
  }
  
  
  regions: Region[] = [];
  cities: City[] = [];
  filteredCities: City[] = [];
  selectedRegion: Region | null = null;
  selectedCity: City | null = null;
  selectedAgent: Agent| null = null;
  agents: Agent[] = [];
  addListingForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;

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
    } else {
      Object.keys(this.addListingForm.controls).forEach(key => {
        const control = this.addListingForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  navigateToMainPage() {
    this.router.navigate(['/']);
  }
  

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
}
