import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-listing-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-listing-page.component.html',
  styleUrl: './add-listing-page.component.css'
})
export class AddListingPageComponent {
  constructor(private fb: FormBuilder) {
    this.myForm();
  }

  addListingForm!: FormGroup;

  myForm() {
    this.addListingForm = this.fb.group({
      forSale: [false],
      forRent: [false],
      address: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      region: [''],
      city: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      area: [null, [Validators.required, Validators.min(0)]],
      numberOfBedrooms: [null, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      agent: ['']
    })
  }
  
  onSubmit() {
    if (this.addListingForm.valid) {
      console.log(this.addListingForm.value);
    } else {
      Object.keys(this.addListingForm.controls).forEach(key => {
        const control = this.addListingForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  previewUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event): void {
    event.preventDefault();
    this.previewUrl = null;
  }
  
}
