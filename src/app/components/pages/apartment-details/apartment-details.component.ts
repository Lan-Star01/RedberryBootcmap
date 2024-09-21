import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendAPIService, RealEstate } from '../../services/backend-api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import bootstrap from '../../../../main.server';

@Component({
  selector: 'app-apartment-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apartment-details.component.html',
  styleUrl: './apartment-details.component.css'
})
export class ApartmentDetailsComponent implements OnInit {

  apartmentId!: string;
  realEstates: RealEstate | null = null;
  allRealEstates: any[] = [];
  filteredRealEstates: any[] = [];
  avatar: string | undefined
  delApartmentId!: number
  transform = 'translateX(0)';
  currentIndex = 0;
  visibleItems = 4;
  totalItems: number = 0;
  

  @ViewChild('checkModal') checkModal!: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router, private APIServices: BackendAPIService,) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.getRealEstateById(id);
    });

    this.route.queryParams.subscribe(queryParams => {
      this.avatar = queryParams['img'];
    });

    //this.getRealEstates();

  }

  getRealEstateById(id: number): void {
    this.APIServices.getRealEstateById(id).subscribe(
      (data: RealEstate) => {
        this.realEstates = data;
        this.getRealEstates();
      },(error) => {
        console.error('Error fetching real estates:', error);
      }
    )
  }

  navigateToMainPage() {
    this.router.navigate(['/']);
  }

  deleteRealEstateCheck(id: number) {
    this.delApartmentId = id
    const modalElement = document.getElementById('checkModal');
    if (modalElement) {
      modalElement.setAttribute('data-bs-toggle', 'modal');
      modalElement.setAttribute('data-bs-target', '#checkModal');
      const modalTrigger = new Event('click');
      modalElement.dispatchEvent(modalTrigger);
    }
  }

  deleteRealEstate(): void {
    let id = this.delApartmentId
    this.APIServices.deleteRealEstateById(id).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error deleting real estate:', error);
      }
    );
  }

  //get realestates 
  getRealEstates(): void {
    this.APIServices.getRealEstates().subscribe(
      (data) => {
        this.allRealEstates = data;
        this.totalItems = this.allRealEstates.length;

        if (this.realEstates?.city?.region_id) {
          this.filteredRealEstates = this.allRealEstates.filter(apartment => 
            apartment.city.region_id === this.realEstates?.city.region_id && apartment.id !== this.realEstates?.id
          );
        }
      }
    )
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = Math.max(0, this.totalItems - this.visibleItems);
    }
    this.updateTransform();
  }

  next() {
    if (this.currentIndex < this.totalItems - this.visibleItems) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.updateTransform();
  }

  updateTransform() {
    const width = (100 / this.visibleItems) * this.currentIndex;
    document.querySelector('.carousel')?.setAttribute('style', `transform: translateX(-${width}%); transition: transform 0.5s ease;`);
  }
}
