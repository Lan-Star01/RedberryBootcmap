import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { MainListingPageComponent } from "../pages/main-listing-page/main-listing-page.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, MainListingPageComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
