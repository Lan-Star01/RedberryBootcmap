import { Routes } from '@angular/router';
import { ApartmentDetailsComponent } from './components/pages/apartment-details/apartment-details.component';
import { MainListingPageComponent } from './components/pages/main-listing-page/main-listing-page.component';
import { AddListingPageComponent } from './components/pages/add-listing-page/add-listing-page.component';

export const routes: Routes = [
    { path: '', component: MainListingPageComponent },
    { path: 'apartment/:id', component: ApartmentDetailsComponent },
    { path: 'add-listing', component: AddListingPageComponent}
];
