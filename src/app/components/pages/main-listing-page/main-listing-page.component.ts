import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-listing-page',
  standalone: true,
  imports: [],
  templateUrl: './main-listing-page.component.html',
  styleUrl: './main-listing-page.component.css'
})
export class MainListingPageComponent {
  constructor(private router: Router) {}

  navigateToApartmentDetails(apartmentId: string) {
    this.router.navigate(['/apartment', apartmentId]);
  }

  navigateToAddListing() {
    this.router.navigate(['/add-listing']);
  }
}
