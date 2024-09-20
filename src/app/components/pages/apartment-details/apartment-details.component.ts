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
  avatar: string | undefined
  delApartmentId!: number

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
  }

  getRealEstateById(id: number): void {
    this.APIServices.getRealEstateById(id).subscribe(
      (data: RealEstate) => {
        console.log(data)
        this.realEstates = data;
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
        console.log('Real estate deleted successfully');
        //this.realEstates?.id !== id;
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error deleting real estate:', error);
      }
    );
  }

}
