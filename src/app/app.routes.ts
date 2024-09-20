import { Router, RouterModule, Routes } from '@angular/router';
import { ApartmentDetailsComponent } from './components/pages/apartment-details/apartment-details.component';
import { MainListingPageComponent } from './components/pages/main-listing-page/main-listing-page.component';
import { AddListingPageComponent } from './components/pages/add-listing-page/add-listing-page.component';
import { NgModule } from '@angular/core';
import { SharedModalService } from './components/services/shared-modal.service';

export const routes: Routes = [
    { path: '', component: MainListingPageComponent },
    { path: 'apartment/:id', component: ApartmentDetailsComponent },
    { path: 'add-listing', component: AddListingPageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {
    constructor(private modalService: SharedModalService, private router: Router) {
      this.modalService.isOpen$.subscribe(isOpen => {
        if (!isOpen) {
          const originComponent = this.modalService.getOriginComponent();
          if (originComponent === 'main') {
            this.router.navigate(['']);
          } else if (originComponent === 'add-listing') {
            this.router.navigate(['/add-listing']);
          }
        }
      });
    }
  }