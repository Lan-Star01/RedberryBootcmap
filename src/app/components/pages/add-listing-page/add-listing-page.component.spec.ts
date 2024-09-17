import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListingPageComponent } from './add-listing-page.component';

describe('AddListingPageComponent', () => {
  let component: AddListingPageComponent;
  let fixture: ComponentFixture<AddListingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddListingPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddListingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
