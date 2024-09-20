import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendAPIService, RealEstate } from '../../services/backend-api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

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

}
