import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { MainListingPageComponent } from "../pages/main-listing-page/main-listing-page.component";
import { ApartmentDetailsComponent } from "../pages/apartment-details/apartment-details.component";
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, MainListingPageComponent, RouterOutlet, HttpClientModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
