import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainListingPageComponent } from './main-listing-page.component';

describe('MainListingPageComponent', () => {
  let component: MainListingPageComponent;
  let fixture: ComponentFixture<MainListingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainListingPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainListingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
