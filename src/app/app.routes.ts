import { Routes } from '@angular/router';
import { ApartmentDetailsComponent } from './components/pages/apartment-details/apartment-details.component';
import { MainListingPageComponent } from './components/pages/main-listing-page/main-listing-page.component';

export const routes: Routes = [
    { path: '', component: MainListingPageComponent },
    { path: 'apartment/:id', component: ApartmentDetailsComponent },
];
